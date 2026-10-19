import type { REDCapRecord } from "@/utils/types";


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


const DISEASE_CATEGORY_MAP = {
  unifocal_followup: "unifocal",
  unifocal_local_recurrence: "unifocal",
  unifocal_distant_metastases: "unifocal",
  locoregional_followup: "locoregional",
  locoregional_progression: "locoregional",
  systemic_metastases_followup: "systemic_metastases",
  systemic_metastases_progression: "systemic_metastases"
} as const;


function buildRowTypeMap(
) {
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
const rowTypeMap = buildRowTypeMap();


function getYear(
  dateValue: any
) {
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


// Funzione per inizializzare le FollowUp Stats
export function initializeFollowupStats(
) {
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


// Funzione per analizzare il FollowUp
export function analyzeFollowupCompleteness (
  recordData: REDCapRecord[],
  followupStats: any
) {
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


// Funzione per costruire la Timeline Summary
export function buildTimelineSummary(
  timeline: any
) {
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


// Funzione per costruire la Status Timeline
export function buildStatusTimeline(
  recordId: string,
  recordData: REDCapRecord[]
) {
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


export function classifyPatients(
  recordId: string,
  recordData: REDCapRecord[]
) {
  const isDiseaseRowType = (value: string): value is keyof typeof DISEASE_CATEGORY_MAP =>
    value in DISEASE_CATEGORY_MAP;
  const isStatusRowType = (value: string): value is keyof typeof STATUS_VARIABLES_MAP =>
    value in STATUS_VARIABLES_MAP;

  const rowsWithType = recordData
    .map(row => {
      const event = row.redcap_event_name || "";
      const instrument = row.redcap_repeat_instrument || "";
      const key = `${event}||${instrument}`;
      const tipoRow = rowTypeMap.get(key);
      return {
        row,
        tipoRow
      };
    })
    .filter((item): item is { row: REDCapRecord; tipoRow: string } => !!item.tipoRow);
      
  // LIFE STATUS UPDATE
  const hasLifeStatusUpdate = rowsWithType.some(item => 
    item.tipoRow === "life_status_update"
  );
    
  // Prendo solo le row che rappresentano un'evoluzione della malattia.
  const diseaseRows = rowsWithType.filter(item =>
    isDiseaseRowType(item.tipoRow)
  );

  // Ordino le disease row per data.
  diseaseRows.sort((a, b) => {
    if (!isStatusRowType(a.tipoRow) || !isStatusRowType(b.tipoRow)) {
      return 0;
    }
    const dateA = a.row[STATUS_VARIABLES_MAP[a.tipoRow]?.date];
    const dateB = b.row[STATUS_VARIABLES_MAP[b.tipoRow]?.date];
    const timeA = dateA
      ? new Date(dateA).getTime()
      : -Infinity;
    const timeB = dateB
      ? new Date(dateB).getTime()
      : -Infinity;
    return timeA === timeB ? 0 : timeA < timeB ? -1 : 1;
    //return timeA - timeB;
  });

  const lastDiseaseRow = diseaseRows.length > 0
    ? diseaseRows[diseaseRows.length - 1]
    : null;

  const lastDiseaseRowType = lastDiseaseRow?.tipoRow || null;

  let lastDiseaseCategory;
  if (lastDiseaseRowType === null || !isDiseaseRowType(lastDiseaseRowType)) {
    lastDiseaseCategory = null;
  }
  else {
    lastDiseaseCategory = lastDiseaseRowType
      ? DISEASE_CATEGORY_MAP[lastDiseaseRowType]
      : null;
  }
        
  return [{
    record: recordId,
    hasLifeStatusUpdate,
    lastDiseaseRowType,
    lastDiseaseCategory
  }];
}
