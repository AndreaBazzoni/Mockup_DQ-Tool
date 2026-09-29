import { useState } from "react";
import { fetchRecords } from "@/fetch/dq-fetch";
import { getRecordData } from "@/fetch/redcap-fetch";
import type { REDCapMetadataField, REDCapInstrVsEventsField, REDCapRepeatingsField, REDCapRecord } from "@/utils/types";


// Funzione per estrarre dai metadati i valori unknown di tutte le variabili che hanno una specifica al riguardo.
// Queste specifiche si trovano nel campo select_choices_or_calculations (per i dropdown) o nel campo field_note (per variabili testuali).
// Non mi interesso delle variabili che hanno note di tipo "if DD unknown...".
export const extractUnknownCodes = (metadata: REDCapMetadataField[], instrumentsVsEvents: REDCapInstrVsEventsField[], repeatings: REDCapRepeatingsField[]) => {
    if (!Array.isArray(metadata)) return [];
    const results: any[] = [];

    metadata.forEach(block => {
      let fieldName = block.field_name;
      let instrumentName = block.form_name;

      const found = instrumentsVsEvents.find(item => item.form === instrumentName);
      if (found === undefined) return [];
      let eventName = found.unique_event_name;

      if (!(isVarRepeating(instrumentName, eventName, repeatings))){
        instrumentName = "";
      }
      
      const note = block.field_note || "";
      const select = block.select_choices_or_calculations || "";

      // Escludo il caso "DD unknown" / "DD Unknown" che può comparire in field_note
      const hasDDUnknown =
      /DD\s+unknown/.test(note);

      if (hasDDUnknown) return [];

      let code = null;

      // Caso 1: field_note → "... If unknown, input ##"
      const noteMatch = note.match(/If unknown,\s*input\s*(\d+)/i);
      if (noteMatch) {
        code = noteMatch[1];
      }

      // Caso 2: select_choices_or_calculations → "...|##, Unknown|..."
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

const isVarRepeating = (instr: string, event: string, repeatingInstrumentsAndEvents: REDCapRepeatingsField[]) => {
    let eventIsRep = repeatingInstrumentsAndEvents.some(item => item.event_name === event);
    if (eventIsRep) {
      // La variabile è repeating se appartiene a event repeating e instrument repeating.
      let instrIsRep = repeatingInstrumentsAndEvents.some(item => item.form_name === instr);
      // Sintassi con "!!" -> ritorna true se instrIsRep è truthy, false se instrIsRep è falsy
      return !!(instrIsRep);
    } 
    else {
      return false;
    }
};


// Funzione per inizializzare la Baseline Counters
export function initializeBaselineCounters() {
	return {
		complete2_blank: 0,
		complete2_1: 0,
		complete2_2: 0,
		complete2_3: 0,
		complete0_blank: 0,
		complete0_1: 0,
		complete0_2: 0,
		complete0_3: 0,
	};
}

// Funzione per inizializzare le FollowUp Stats
function initializeFollowupStats() {
	return {
		unifocal_complete: {
			follow_up: 0,
			local_recurrence: 0,
			distant_metastases: 0
		},
		unifocal_incomplete: {
			follow_up: 0,
			local_recurrence: 0,
			distant_metastases: 0
		},
		locoregional_complete: {
			follow_up: 0,
			progression: 0
		},
		locoregional_incomplete: {
			follow_up: 0,
			progression: 0
		},
		systemic_metastases_complete: {
			follow_up: 0,
			progression: 0
		},
		systemic_metastases_incomplete: {
			follow_up: 0,
			progression: 0
		}
	};
}


// Funzione per costruire la Status Timeline
export function buildStatusTimeline(recordId: string, recordData: REDCapRecord[]) {
	const rowTypeMap = buildRowTypeMap();

	const baselineRow = recordData.find(
		r =>
			r.redcap_event_name === "baseline_arm_1" &&
			r.redcap_repeat_instrument === ""
	);

	const diagnosisYear = getYear(
		baselineRow?.bl_1st_pathol_ddiag
	);

	const results = [];

	for (const row of recordData) {
		const event = row.redcap_event_name;
		const instrument = row.redcap_repeat_instrument;
		const key = `${event}||${instrument}`;
		const tipoRow = rowTypeMap.get(key);
		if (!tipoRow || tipoRow === "baseline_and_treatment_at_first_presentation") {
			continue;
		}
    if (!(tipoRow in STATUS_VARIABLES_MAP)) {
      continue;
    }
		const map = STATUS_VARIABLES_MAP[tipoRow as keyof typeof STATUS_VARIABLES_MAP];

		const statusDate = row[map.date];
		const status = row[map.status];

		results.push({
			record: recordId,
			diagnosisYear,
			statusYear: getYear(statusDate),
			status,
			instrument,
			event,
			tipoRow
		});
	}

	return results;
}

const STATUS_VARIABLES_MAP = {
    unifocal_followup: {
        date: "ufu_date",
        status: "ufu_status",
    },
    unifocal_local_recurrence: {
        date: "ulr_date",
        status: "ulr_status",
    },
    unifocal_distant_metastases: {
        date: "udm_date",
        status: "udm_status",
    },
    locoregional_followup: {
        date: "lfu_date",
        status: "lfu_status",
    },
    locoregional_progression: {
        date: "lpr_date",
        status: "lpr_status",
    },
    systemic_metastases_followup: {
        date: "sfu_date",
        status: "sfu_status",
    },
    systemic_metastases_progression: {
        date: "spr_date",
        status: "spr_status",
    },
    life_status_update: {
        date: "lsu_status_date",
        status: "lsu_status",
    },
} as const;

function buildRowTypeMap() {
	const ROW_TYPE_MAPPING = [
		{ instrument: "", event: "baseline_arm_1", tipoRow: "baseline_and_treatment_at_first_presentation" },
		{ instrument: "unifocal_followup", event: "unifocal_arm_1", tipoRow: "unifocal_followup" },
		{ instrument: "unifocal_local_recurrence", event: "unifocal_arm_1", tipoRow: "unifocal_local_recurrence" },
		{ instrument: "", event: "unifocal_arm_1", tipoRow: "unifocal_distant_metastases" },
		{ instrument: "locoregional_followup", event: "locoregional_arm_1", tipoRow: "locoregional_followup" },
		{ instrument: "locoregional_progression", event: "locoregional_arm_1", tipoRow: "locoregional_progression" },
		{ instrument: "systemic_metastases_followup", event: "systemic_metastase_arm_1", tipoRow: "systemic_metastases_followup" },
		{ instrument: "systemic_metastases_progression", event: "systemic_metastase_arm_1", tipoRow: "systemic_metastases_progression" },
		{ instrument: "", event: "life_status__clini_arm_1", tipoRow: "life_status_update" },
	];
	const map = new Map();
	for (const item of ROW_TYPE_MAPPING) {
		const key = `${item.event}||${item.instrument}`;
		map.set(key, item.tipoRow);
	}
	return map;
}

function getYear(dateValue: any) {
	if (!dateValue) return null;
	// Se è già un numero tipo "2020"
	if (/^\d{4}$/.test(dateValue)) {
		return dateValue;
	}
	const date = new Date(dateValue);
	// Controllo validità
	if (isNaN(date.getTime())) {
		return null;
	}
	return date.getFullYear().toString();
}


// Funzione per costruire la Disease Extension Timeline
export function buildDiseaseExtensionTimeline(recordId: string, recordData: REDCapRecord[], baselineDiseaseExtensionMap: any) {
	const timeline = [];

	const baselineRow = recordData.find(
		row =>
			row.redcap_event_name === "baseline_arm_1" &&
			row.redcap_repeat_instrument === ""
	);

	const diagnosisDate = baselineRow?.bl_1st_pathol_ddiag;
	const diagnosisYear = getYear(diagnosisDate);

	const baselineDiseaseExtension = baselineDiseaseExtensionMap[baselineRow?.bl_dis_ext];

	if (diagnosisDate && baselineDiseaseExtension) {
		const baselineDate = new Date(diagnosisDate);
		if (!isNaN(baselineDate.getTime())) {
			timeline.push({
				record: recordId,
				diagnosisDate,
				diagnosisYear,
				date: diagnosisDate,
				event: "baseline_arm_1",
				redcap_repeat_instrument: "",
				instrument: "baseline_and_treatment_at_first_presentation",
				diseaseExtension: baselineDiseaseExtension,
				isBaseline: true
			});
		}
	}

	for (const row of recordData) {
		const event = row.redcap_event_name;
		const redcapRepeatInstrument  = row.redcap_repeat_instrument;
		const config = Object.values(DISEASE_EXTENSION_MAP).find(
			item =>
				item.event === event &&
				item.redcap_repeat_instrument === redcapRepeatInstrument 
		);
		if (!config) {
			continue;
		}
		const dateValue = row[config.date];
		// Follow-up senza data: non può definire l'estensione attuale.
		if (!dateValue) {
			continue;
		}
		const date = new Date(dateValue);
		if (isNaN(date.getTime())) {
			continue;
		}
		timeline.push({
			record: recordId,
			diagnosisDate,
			diagnosisYear,
			date: dateValue,
			event,
			redcap_repeat_instrument: redcapRepeatInstrument,
			diseaseExtension: `${event}, ${config.instrument}`,
			isBaseline: false
		});
	}

	// Ordina dal più vecchio al più recente
	timeline.sort(
		(a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime()
	);

	return timeline;
}

const DISEASE_EXTENSION_MAP = {
  unifocal_followup: {
    event: "unifocal_arm_1",
    redcap_repeat_instrument: "unifocal_followup",
    instrument: "unifocal_followup",
    date: "ufu_date"
  },
  unifocal_local_recurrence: {
    event: "unifocal_arm_1",
    redcap_repeat_instrument: "unifocal_local_recurrence",
    instrument: "unifocal_local_recurrence",
    date: "ulr_date"
  },
  unifocal_distant_metastases: {
    event: "unifocal_arm_1",
    redcap_repeat_instrument: "",
    instrument: "unifocal_distant_metastases",
    date: "udm_date"
  },
  locoregional_followup: {
    event: "locoregional_arm_1",
    redcap_repeat_instrument: "locoregional_followup",
    instrument: "locoregional_followup",
    date: "lfu_date"
  },
  locoregional_progression: {
    event: "locoregional_arm_1",
    redcap_repeat_instrument: "locoregional_progression",
    instrument: "locoregional_progression",
    date: "lpr_date"
  },
  systemic_metastases_followup: {
    event: "systemic_metastase_arm_1",
    redcap_repeat_instrument: "systemic_metastases_followup",
    instrument: "systemic_metastases_followup",
    date: "sfu_date"
  },
  systemic_metastases_progression: {
    event: "systemic_metastase_arm_1",
    redcap_repeat_instrument: "systemic_metastases_progression",
    instrument: "systemic_metastases_progression",
    date: "spr_date"
  }
};


// Funzione per aggiornare la Disease Extension Patients
export function updateDiseaseExtensionPatients(diseaseExtensionPatients: any, timeline: any) {
  if (!timeline.length) {
    return null;
  }

  // Primo elemento = baseline
  const baseline = timeline.find((item: any) => item.isBaseline);

  // Ultimo elemento = disease extension più recente
  const latest = timeline[timeline.length - 1];

  const diagnosisYear = latest.diagnosisYear;
  const baselineDiseaseExtension = baseline.diseaseExtension;
  const currentDiseaseExtension = latest.diseaseExtension;

  // Salvo il paziente solo se sono disponibili sia baseline che current disease extension
  if (!diagnosisYear || !baselineDiseaseExtension || !currentDiseaseExtension) {
    return null;
  }

  diseaseExtensionPatients[latest.record] = {
      record: latest.record,
      diagnosisYear,
      baselineDiseaseExtension,
      currentDiseaseExtension
  };
}

// Funzione per aggiornare la Disease Extension Counters
export function updateDiseaseExtensionCounters(diseaseExtensionCounters: any, timeline: any) {
  if (!timeline.length) {
    return null;
  }

  // Primo elemento = baseline
  const baseline = timeline.find((item: any) => item.isBaseline);

  // Ultimo elemento = disease extension più recente
  const latest = timeline[timeline.length - 1];

  const diagnosisYear = latest.diagnosisYear;
  const baselineDiseaseExtension = baseline.diseaseExtension;
  const currentDiseaseExtension = latest.diseaseExtension;

  // Il paziente entra nel counter solo se sono disponibili entrambe le disease extension
  if (!diagnosisYear || !baselineDiseaseExtension || !currentDiseaseExtension) {
    return null;
  }

  const key = `${diagnosisYear}|||${baselineDiseaseExtension}|||${currentDiseaseExtension}`;

  if (!diseaseExtensionCounters[key]) {
    diseaseExtensionCounters[key] = {
      diagnosisYear,
      baselineDiseaseExtension,
      currentDiseaseExtension,
      count: 0
    };
  }

  diseaseExtensionCounters[key].count++;
}


// Funzione per processare la Baseline
export function processBaselineRecord(recordData: REDCapRecord[], baselineCounters: any) {
	const baselineRow = recordData.find(
		(row) =>
			row.redcap_event_name === "baseline_arm_1" &&
			row.redcap_repeat_instrument === ""
	);

	if (!baselineRow) {
		return;
	}

	const complete = baselineRow.baseline_and_treatment_at_first_presentation_complete;
	const disExt = baselineRow.bl_dis_ext;

	// complete = 2
	if (complete === "2") {
		if (disExt === "") baselineCounters.complete2_blank++;
		if (disExt === "1") baselineCounters.complete2_1++;
		if (disExt === "2") baselineCounters.complete2_2++;
		if (disExt === "3") baselineCounters.complete2_3++;
	}

	// complete = 0
	if (complete === "0") {
		if (disExt === "") baselineCounters.complete0_blank++;
		if (disExt === "1") baselineCounters.complete0_1++;
		if (disExt === "2") baselineCounters.complete0_2++;
		if (disExt === "3") baselineCounters.complete0_3++;
	}
}


// Funzione per analizzare il FollowUp
function analyzeFollowupCompleteness(recordData: REDCapRecord[], followupStats: any) {
	const FOLLOWUP_CHECKS = [
		////////////////////////////////
		// UNIFOCAL
		////////////////////////////////
		{
			form: 'unifocal_followup',
			field: 'unifocal_followup_complete',
			completeGroup: 'unifocal_complete',
			incompleteGroup: 'unifocal_incomplete',
			key: 'follow_up'
		},
		{
			form: 'unifocal_local_recurrence',
			field: 'unifocal_local_recurrence_complete',
			completeGroup: 'unifocal_complete',
			incompleteGroup: 'unifocal_incomplete',
			key: 'local_recurrence'
		},
		{
			form: 'unifocal_distant_metastases',
			field: 'unifocal_distant_metastases_complete',
			completeGroup: 'unifocal_complete',
			incompleteGroup: 'unifocal_incomplete',
			key: 'distant_metastases'
		},
		////////////////////////////////
		// LOCOREGIONAL
		////////////////////////////////
		{
			form: 'locoregional_followup',
			field: 'locoregional_followup_complete',
			completeGroup: 'locoregional_complete',
			incompleteGroup: 'locoregional_incomplete',
			key: 'follow_up'
		},
		{
			form: 'locoregional_progression',
			field: 'locoregional_progression_complete',
			completeGroup: 'locoregional_complete',
			incompleteGroup: 'locoregional_incomplete',
			key: 'progression'
		},
		////////////////////////////////
		// SYSTEMIC METASTASES
		////////////////////////////////
		{
			form: 'systemic_metastases_followup',
			field: 'systemic_metastases_followup_complete',
			completeGroup: 'systemic_metastases_complete',
			incompleteGroup: 'systemic_metastases_incomplete',
			key: 'follow_up'
		},
		{
			form: 'systemic_metastases_progression',
			field: 'systemic_metastases_progression_complete',
			completeGroup: 'systemic_metastases_complete',
			incompleteGroup: 'systemic_metastases_incomplete',
			key: 'progression'
		}
	];

	for (const cfg of FOLLOWUP_CHECKS) {
		const rows = recordData.filter(
			r => r.redcap_repeat_instrument === cfg.form
		);
		if (rows.length === 0) {
			continue;
		}
		const statuses = rows.map(
			r => r[cfg.field]
		);
		const allComplete = statuses.every(
			v => v === "2"
		);
		const hasIncomplete = statuses.some(
			v => v === "0"
		);
		if (allComplete) {
			followupStats[cfg.completeGroup][cfg.key]++;
		}
		if (hasIncomplete) {
			followupStats[cfg.incompleteGroup][cfg.key]++;
		}
	}
}


// Funzione che processa gli Unknown Record
export function processUnknownRecord(recordId: string, recordData: REDCapRecord[], unknownCodes: any[], unknownMatrix: any) {
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


// Funzione per costruire la Unknown Summary
export function buildUnknownSummary(unknownMatrix: any) {
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

// Funzione per costruire la Timeline Summary
export function buildTimelineSummary(timeline: any) {
	const map = new Map();
	for (const item of timeline) {
		// Escludo date e status lasciati null
		if (!item.statusYear || item.status === undefined || item.status === null || item.status === "") {
			continue;
		}
		const key = [
			item.diagnosisYear,
			item.statusYear,
			item.status
		].join("|");
		if (!map.has(key)) {
			map.set(key, {
				diagnosisYear: item.diagnosisYear,
				statusYear: item.statusYear,
				status: item.status,
				count: 0
			});
		}
		map.get(key).count++;
	}
	return Array.from(map.values());
}



export const obtainParamsExcelDQ = async(
  centerUrl: string,
  token: string,
  metadata: REDCapMetadataField[],
  instrumentsVsEvents: REDCapInstrVsEventsField[],
  repeatings: REDCapRepeatingsField[]
) => {
	const [unknownSummaryState, setUnknownSummaryState] = useState({});
	const [timelineSummaryState, setTimelineSummaryState] = useState({});
  const [baselineCountersState, setBaselineCountersState] = useState({});
	const [diseaseExtensionCountersState, setDiseaseExtensionCountersState] = useState({});

  try {
    let fetchedRecords = await fetchRecords(centerUrl, token, 'bl_record_id');

    // Vettore per l'esecuzione di record selezionati.
    // Se vuoto, l'esecuzione avviene su tutti i record presenti.
    let whiteRecords: string[] = [];
    
    // Leggo i record estratti per due volte.
    // La prima per gestire tutti i conteggi descrittivi (disease extent, diagnosi per anno, ecc.) e compilare i fogli excel relativi.
    // La seconda per gestire tutti i DQ check e salvarli nel foglio relativo.
    
    const patientNr = fetchedRecords.length;
    console.log("Total nr of patients = " + patientNr);

    // Estraggo a partire dal data dictionary un elenco delle variabili (con rispettivi instrument ed event).
    // Alle variabili è stato definito un codice numerico corrispondente a "unknown".
    const unknownCodes = extractUnknownCodes(metadata, instrumentsVsEvents, repeatings);
    const unknownMatrix = {};
    const allTimeline = [];

    // Inizializzo i counter per il foglio "complete patients" (conteggi delle disease extension).
    const baselineCounters = initializeBaselineCounters();
    const followupStats = initializeFollowupStats();

    const diseaseExtensionPatients = {};
    const diseaseExtensionCounters = {};

    const baselineDiseaseExtensionMap: any = {};
    const blDisExtMeta = metadata.find(
      m => m.field_name === "bl_dis_ext"
    );

    if (blDisExtMeta?.select_choices_or_calculations) {
      const choices = blDisExtMeta.select_choices_or_calculations.split("|");
      for (const choice of choices) {
        const separatorIndex = choice.indexOf(",");
        if (separatorIndex === -1) {
          continue;
        }
        const value = choice.substring(0, separatorIndex).trim();
        const label = choice
          .substring(separatorIndex + 1)
          .trim()
          .replace(/\s*\([^)]*\)/g, "")
          .trim();

        baselineDiseaseExtensionMap[value] =
          `${label} at presentation`;
      }
    }

    // Process each record
    for (const recordId of fetchedRecords) {
      // Per limitare esecuzione a record selezionati
      if (whiteRecords && (whiteRecords.length === 0 || whiteRecords.includes(recordId))) {
        let recordData = await getRecordData(centerUrl, token, recordId);
        
        const timeline = buildStatusTimeline(recordId, recordData);
        allTimeline.push(...timeline);
        
        const diseaseExtensionTimeline = buildDiseaseExtensionTimeline(recordId, recordData, baselineDiseaseExtensionMap);
        updateDiseaseExtensionPatients(diseaseExtensionPatients, diseaseExtensionTimeline);
        updateDiseaseExtensionCounters(diseaseExtensionCounters, diseaseExtensionTimeline);
        
        processBaselineRecord(recordData, baselineCounters);
        analyzeFollowupCompleteness(recordData, followupStats);

        processUnknownRecord(recordId, recordData, unknownCodes, unknownMatrix);
      }
    }

    const unknownSummary = buildUnknownSummary(unknownMatrix);
    setUnknownSummaryState(unknownSummary);
    const timelineSummary = buildTimelineSummary(allTimeline);
    setTimelineSummaryState(timelineSummary);

    setBaselineCountersState(baselineCounters);
    setDiseaseExtensionCountersState(diseaseExtensionCounters);
  }
    
  catch (err) {
    console.log("Failed to obtain parameters of Data Quality: ", err);
    throw new Error("Failed to obtain parameters of Data Quality.");
  } 
    
  finally {
    return {unknownSummaryState, timelineSummaryState, baselineCountersState, diseaseExtensionCountersState};
  }
}