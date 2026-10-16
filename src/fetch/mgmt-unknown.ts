import { runBranchingLogic, isVarRepeating } from "@/DoDataQuality";
import type { REDCapRecord, REDCapMetadataField, REDCapInstrVsEventsField, REDCapRepeatingsField, DQContext } from "@/utils/types";


// Funzione per costruire la Unknown Summary
export function buildUnknownSummary(
  unknownMatrix: any
) {
	return Object.values(unknownMatrix).map((row: any) => {
		let denominator = 0;
		let matches = 0;
		for (const key of Object.keys(row)) {
			if (key.startsWith("elig_")) {
				denominator += row[key];
			}
			if (key.startsWith("match_")) {
				matches += row[key];
			}
		}
		return {
			field: row.field,
			denominator,
			percent:
				denominator > 0
					? (matches / denominator) * 100
					: 0,
		};
	});
}


// Funzione che processa gli Unknown Record
export function processUnknownRecord(
  recordId: string,
  recordData: REDCapRecord[],
  unknownCodes: any[],
  unknownMatrix: any
) {
  for (const rowData of recordData) {
    unknownCodes.forEach((codeObj) => {
      const fieldName = codeObj.field_name;
      const eligible = (codeObj.event_name === rowData.redcap_event_name && codeObj.form_name === rowData.redcap_repeat_instrument)
        ? 1
        : 0;
      const match = (eligible && rowData[fieldName] === codeObj.val)
        ? 1
        : 0;

      if (!unknownMatrix[fieldName]) {
        unknownMatrix[fieldName] = {
          field: fieldName
        };
      }

      const eligKey = `elig_${recordId}`;
      const matchKey = `match_${recordId}`;

      if (!unknownMatrix[fieldName][eligKey]) {
        unknownMatrix[fieldName][eligKey] = 0;
      }

      if (!unknownMatrix[fieldName][matchKey]) {
        unknownMatrix[fieldName][matchKey] = 0;
      }

      unknownMatrix[fieldName][eligKey] += eligible;
      unknownMatrix[fieldName][matchKey] += match;
    });
  }
}


// Funzione per estrarre dai metadati i valori unknown di tutte le variabili che hanno una specifica al riguardo.
// Queste specifiche si trovano nel campo select_choices_or_calculations (per i dropdown) o nel campo field_note (per variabili testuali).
// Non mi interesso delle variabili che hanno note di tipo "if DD unknown...".
export const extractUnknownCodes = (
  metadata: REDCapMetadataField[],
  instrumentsVsEvents: REDCapInstrVsEventsField[],
  repeatings: REDCapRepeatingsField[]
) => {
    if (!Array.isArray(metadata)) return [];
    const results: any[] = [];

    metadata.forEach(block => {
      let fieldName = block.field_name;
      let instrumentName = block.form_name;

      const found = instrumentsVsEvents.find(item => item.form === instrumentName);
      if (found === undefined) return [];
      let eventName = found.unique_event_name;

      if (!(isVarRepeating(repeatings, instrumentName, eventName))){
        instrumentName = "";
      }
      
      const note = block.field_note || "";
      const select = block.select_choices_or_calculations || "";

      // Escludo il caso "DD unknown" / "DD Unknown" che può comparire in field_note
      const hasDDUnknown =
      /DD\s+unknown/.test(note);

      if (hasDDUnknown) return [];

      let code = null;

      // Caso 1: field_note -> "... If unknown, input ##"
      const noteMatch = note.match(/If unknown,\s*input\s*(\d+)/i);
      if (noteMatch) {
        code = noteMatch[1];
      }

      // Caso 2: select_choices_or_calculations -> "...|##, Unknown|..."
      const selectMatch = select.match(/(?:^|\|)\s*(\d+)\s*,\s*Unknown/i);
      if (selectMatch) {
        code = selectMatch[1];
      }

      if (code) {
        results.push({ field_name: fieldName, form_name: instrumentName, event_name: eventName, val: code });
      }
    });

  return results;
}


// Processa tutte le row di un paziente per il calcolo dei missing.
//  - missingMetadata: metadata delle variabili che vogliamo controllare.
//  - missingMatrix: struttura cumulativa che raccoglie i pazienti eleggibili e quelli con missing.
//  - rowTypeMapping: mapping tra (event + instrument) e (tipoRow).
export function processMissingRecord(
  context: DQContext,
  recordData: REDCapRecord[],
  missingMetadata: REDCapMetadataField[],
  missingMatrix: any
) {
  // Analizzo una row alla volta.
  for (const row of recordData) {
    // Determino il tipo della row.
    const rowType = getRowType(row);
    // Se non riesco a determinare il tipo, non posso sapere quali variabili siano attese.
    if (!rowType) {
      continue;
    }
    // Prendo dal metadata solo le variabili appartenenti a questo tipo di row.
    const expectedVariables = missingMetadata.filter(
      metadataItem => metadataItem.form_name === rowType
    );
    const expectedVarBranch = getExpectedVariablesBranching(context, expectedVariables, row);

    // Controllo ogni variabile attesa.
    for (const variable of expectedVarBranch) {
      const fieldName = variable.field_name;
      //Inizializzo la struttura della variabile.
      if (!missingMatrix[fieldName]) {
        missingMatrix[fieldName] = {
          field: fieldName,
          // utile per debug / eventuale report futuro
          expectedRowType: rowType,
          // Set di recordId eleggibili (evita di contare più volte un paziente con più repeat instance)
          denominatorPatients: new Set(),
          // Set di recordId per i quali la variabile è risultata missing almeno una volta.
          missingPatients: new Set()
        };
      }
      // Il paziente è eleggibile per questa variabile. Anche se esistono n repeat instance, il recordId viene contato una sola volta.
      missingMatrix[fieldName].denominatorPatients.add(recordData[0].bl_record_id);
      // Se la variabile è vuota in questa row, il paziente viene classificato come missing. Anche qui il Set garantisce una sola occorrenza per paziente.
      if (isMissingValue(row[fieldName])) {
        missingMatrix[fieldName].missingPatients.add(recordData[0].bl_record_id);
      }
    }
  }
}


const getExpectedVariablesBranching = (
  context: DQContext,
  expectedVariables: REDCapMetadataField[],
  row: REDCapRecord
) => {
  const expectedVarBranch = [];
  for (const variable of expectedVariables) {
      // 1. Se non ha branching logic, la variabile è eleggibile.
      if (!variable.branching_logic || !variable.branching_logic.trim()) {
        expectedVarBranch.push(variable);
        continue;
      }
      // 2. Determino l'istanza corrente, se presente.
      let instance = null;
      if (row.redcap_repeat_instance !== null && row.redcap_repeat_instance !== "") {
        instance = Number(row.redcap_repeat_instance);
      }
      // 3. Valuto la branching logic.
      const result = runBranchingLogic(context, variable, instance);
      // 4. Mantengo solo le variabili con branching true.
      if (result === true) {
        expectedVarBranch.push(variable);
      }
  }
  return expectedVarBranch;
};


// Stabilisce se il valore di una variabile è missing.
// [ NOTA: 0 e "0" = NON sono missing ]
const isMissingValue = (
  value: string
) => {
    return (
        value === null ||
        value === undefined ||
        value === ""
    );
};


// Determina il tipo di una row di recordData. Il confronto viene fatto usando:
//  - row.redcap_event_name
//  - row.redcap_repeat_instrument
// [ cercando la corrispondente combinazione in ROW_TYPE_MAPPING ]
const getRowType = (
  row: REDCapRecord
) => {
  const event = row.redcap_event_name || "";
  const instrument = row.redcap_repeat_instrument || "";
  const mapping = ROW_TYPE_MAPPING.find(item => (
    item.event === event && item.instrument === instrument
  ));
  return mapping?.tipoRow || null;
};


// ====================
// MISSING MANAGEMENT
// ====================
const ROW_TYPE_MAPPING = [
  {
    instrument: "",
    event: "baseline_arm_1",
    tipoRow: "baseline_and_treatment_at_first_presentation"
  },
  {
    instrument: "unifocal_followup",
    event: "unifocal_arm_1",
    tipoRow: "unifocal_followup"
  },
  {
    instrument: "unifocal_local_recurrence",
    event: "unifocal_arm_1",
    tipoRow: "unifocal_local_recurrence"
  },
  {
    instrument: "",
    event: "unifocal_arm_1",
    tipoRow: "unifocal_distant_metastases"
  },
  {
    instrument: "locoregional_followup",
    event: "locoregional_arm_1",
    tipoRow: "locoregional_followup"
  },
  {
    instrument: "locoregional_progression",
    event: "locoregional_arm_1",
    tipoRow: "locoregional_progression"
  },
  {
    instrument: "systemic_metastases_followup",
    event: "systemic_metastase_arm_1",
    tipoRow: "systemic_metastases_followup"
  },
  {
    instrument: "systemic_metastases_progression",
    event: "systemic_metastase_arm_1",
    tipoRow: "systemic_metastases_progression"
  },
  {
    instrument: "",
    event: "life_status__clini_arm_1",
    tipoRow: "life_status_update"
  }
];
