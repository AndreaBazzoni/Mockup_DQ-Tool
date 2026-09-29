import type { REDCapRecord } from "@/utils/types";


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