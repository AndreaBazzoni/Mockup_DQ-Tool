import { runBranchingLogic, isVarRepeating } from "@/DoDataQuality";
import type { REDCapRecord, REDCapMetadataField, REDCapInstrVsEventsField, REDCapRepeatingsField, DQContext } from "@/utils/types";



// Function to build the Unknown Summary
export function buildUnknownSummary (
  unknownMatrix: any,
  missingMatrix: any
) {
	return Object.values(missingMatrix).map((row: any) => {
		const denominator = row.denominatorPatients.size;
		const matches = unknownMatrix[row.field]?.unknownPatients.size ?? 0;
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


// Function to build the Missing Summary
export function buildMissingSummary (
  missingMatrix: any
) {
  return Object.values(missingMatrix).map((row: any) => {
    const denominatorMissing = row.denominatorPatients.size;
    const missing = row.missingPatients.size;
    return {
      field: row.field,
      denominatorMissing,
      missing,
      percent:
        denominatorMissing > 0
          ? (missing / denominatorMissing) * 100
          : 0
    };
  });
}


// Processes all rows for a patient to calculate unknown values.
//  - unknownCodes: "unknown" values from the metadata for all variables that have a specification regarding this.
//  - unknownMatrix: a cumulative structure that tracks eligible patients and those with unknown values.
export function processUnknownRecord (
  context: DQContext,
  recordId: string,
  recordData: REDCapRecord[],
  unknownCodes: any[],
  unknownMatrix: any,
  missingMetadata: any
) {
  for (const rowData of recordData) {
    const rowType = getRowType(rowData);

    if (!rowType) {
      continue;
    }

    // Considero esclusivamente le righe complete
    const completeField = `${rowType}_complete`;
    if (rowData[completeField] !== "2") {
        continue;
    }

    // Stessa logica di branching utilizzata da Missing
    const expectedVariables = missingMetadata.filter((item: any) =>
      item.form_name === rowType
    );
    const expectedVarBranch = getExpectedVariablesBranching(context, expectedVariables, rowData);
    const expectedFields = new Set(expectedVarBranch.map((item: any) =>
      item.field_name
    ));

    for (const codeObj of unknownCodes) {
      const fieldName = codeObj.field_name;
      const eligible =
        codeObj.event_name === rowData.redcap_event_name &&
        codeObj.form_name === rowData.redcap_repeat_instrument &&
        expectedFields.has(fieldName);
      if (!eligible) {
        continue;
      }
      if (rowData[fieldName] === codeObj.val) {
        if (!unknownMatrix[fieldName]) {
          unknownMatrix[fieldName] = {
            field: fieldName,
            unknownPatients: new Set()
          };
        }
        // At least one: il paziente viene contato una sola volta
        unknownMatrix[fieldName].unknownPatients.add(recordId);
      }
    }
  }
}


// Processes all rows for a patient to calculate missing values.
//  - missingMetadata: metadata for the variables to be checked.
//  - missingMatrix: a cumulative structure that tracks eligible patients and those with missing values.
//  - rowTypeMapping: a mapping between (event + instrument) and (rowType).
export function processMissingRecord (
  context: DQContext,
  recordData: REDCapRecord[],
  missingMetadata: REDCapMetadataField[],
  missingMatrix: any
) {
  // I analyze one row at a time.
  for (const row of recordData) {
    // I determine the row type.
    const rowType = getRowType(row);
    // If I can't determine the type, I can't know which variables are expected.
    if (!rowType) {
      continue;
    }

    const completeField = `${rowType}_complete`;
    if (row[completeField] !== "2") {
      continue;
    }

    // I take from metadata only variables that belong to this type of row.
    const expectedVariables = missingMetadata.filter(
      metadataItem => metadataItem.form_name === rowType
    );
    const expectedVarBranch = getExpectedVariablesBranching(context, expectedVariables, row);

    // I check every expected variable.
    for (const variable of expectedVarBranch) {
      const fieldName = variable.field_name;
      // I am initializing the variable structure.
      if (!missingMatrix[fieldName]) {
        missingMatrix[fieldName] = {
          field: fieldName,
          // It is useful for debug / report in future
          expectedRowType: rowType,
          // Set of eligible recordIds, avoids counting a patient multiple times due to multiple repeat instances.
          denominatorPatients: new Set(),
          //Set of recordIds for which the variable was found to be missing at least once.
          missingPatients: new Set()
        };
      }
      // The patient is eligible for this variable. Even if there are n repeated instances, the recordId is counted only once.
      missingMatrix[fieldName].denominatorPatients.add(recordData[0].bl_record_id);
      // If the variable is empty in this row, the patient is classified as "missing." Also in this case, the Set ensures there is only one occurrence per patient.
      if (isMissingValue(row[fieldName])) {
        missingMatrix[fieldName].missingPatients.add(recordData[0].bl_record_id);
      }
    }
  }
}


// ============================================================
// UNIFIED UNKNOWN + MISSING (SUMMARY)
// ============================================================
// Versione che elenca TUTTE le variabili (tranne quelle "descriptive" e la variabile "version"), anche quelle con 0 (sia in missing, sia in unknown).
// Viene mantenuto l'ordine trovato in metadata. Utilizza le label.
export function buildUnknownMissingSummary(
  unknownMatrix: any,
  missingMatrix: any,
  metadata: REDCapMetadataField[]
) {
  const unknownSummary = buildUnknownSummary(unknownMatrix, missingMatrix);
  const missingSummary = buildMissingSummary(missingMatrix);

  // Indicizzo i risultati usando il nome tecnico della variabile.
  const unknownByField = new Map(
    unknownSummary.map(item => [item.field, item])
  );
  const missingByField = new Map(
    missingSummary.map(item => [item.field, item])
  );
  
  // Costruisco l'elenco seguendo l'ordine dei metadata.
  // Escludo i campi "descriptive" e la variabile "version".
  const seenFields = new Set();
  const summary = [];

  for (const meta of metadata) {
    const fieldName = meta.field_name;

    if (!fieldName) continue;
    if (meta.field_type === "descriptive") continue;
    if (fieldName === "version") continue;
    if (seenFields.has(fieldName)) continue;

    seenFields.add(fieldName);

    const unknown = unknownByField.get(fieldName);
    const missing = missingByField.get(fieldName);

    const fieldLabel = (meta.field_label || fieldName)
      .replace(/<\/?(?:div|p|u|strong)\b[^>]*>|<br\s*\/?>/gi, "")
      .trim();

    summary.push({
      field: fieldLabel,
      formName: (meta.form_name || "").replace(/_/g, " "),
      denominatorMissing: missing?.denominatorMissing ?? 0,
      percentMissing: missing?.percent ?? 0,
      percentUnknown: unknown?.percent ?? 0
      //percentMissing: `${Math.round(missing?.percent ?? 0)} %`,
      //percentUnknown: `${Math.round(unknown?.percent ?? 0)} %`
    });
  }

  return summary;
}


// Function to extract "unknown" values from the metadata for all variables that have a specification regarding this.
// These specifications are found in the "select_choices_or_calculations" field (for dropdowns) or in the "field_note" field (for text variables).
// I am not concerned with variables that have notes such as "if DD unknown...".
export const extractUnknownCodes = (
  metadata: REDCapMetadataField[],
  instrumentsVsEvents: REDCapInstrVsEventsField[],
  repeatings: REDCapRepeatingsField[]
) => {
    if (!Array.isArray(metadata)) return [];
    
    const results: any[] = [];

    metadata.forEach(block => {
      const fieldName = block.field_name;
      let instrumentName = block.form_name;

      const found = instrumentsVsEvents.find(item => item.form === instrumentName);
      if (found === undefined) return [];
      const eventName = found.unique_event_name;

      if (!(isVarRepeating(repeatings, instrumentName, eventName))) {
        instrumentName = "";
      }
      
      const note = block.field_note || "";
      const select = block.select_choices_or_calculations || "";

      // I exclude the case "DD unknown" / "DD Unknown" (that can appear in field_note).
      const hasDDUnknown =
      /DD\s+unknown/.test(note);

      if (hasDDUnknown) return [];

      let code = null;

      // Case 1: field_note -> "... If unknown, input ##"
      const noteMatch = note.match(/If unknown,\s*input\s*(\d+)/i);
      if (noteMatch) {
        code = noteMatch[1];
      }

      // Case 2: select_choices_or_calculations -> "...|##, Unknown|..."
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


const getExpectedVariablesBranching = (
  context: DQContext,
  expectedVariables: REDCapMetadataField[],
  row: REDCapRecord
) => {
  const expectedVarBranch = [];
  for (const variable of expectedVariables) {
      // 1. If it does not have branching logic, the variable is eligible.
      if (!variable.branching_logic || !variable.branching_logic.trim()) {
        expectedVarBranch.push(variable);
        continue;
      }
      // 2. I determine the current instance, if present.
      let instance = null;
      if (row.redcap_repeat_instance !== null && row.redcap_repeat_instance !== "") {
        instance = Number(row.redcap_repeat_instance);
      }
      // 3. I evaluate the branching logic.
      const result = runBranchingLogic(context, variable, instance);
      // 4. I keep only the variables with branching set to true.
      if (result === true) {
        expectedVarBranch.push(variable);
      }
  }
  return expectedVarBranch;
};


// Determines if the value of a variable is missing.
// [ NOTE: 0 and "0" are NOT considered missing ]
const isMissingValue = (
  value: string
) => {
    return (
        value === null ||
        value === undefined ||
        value === ""
    );
};


// Determines the type of a row from recordData. The comparison is performed using:
//  - row.redcap_event_name
//  - row.redcap_repeat_instrument
// [ by looking for the corresponding combination in ROW_TYPE_MAPPING ]
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
export const ROW_TYPE_MAPPING = [
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
