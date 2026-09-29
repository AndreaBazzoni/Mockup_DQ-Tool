import { useState } from "react";
import { fetchRecords } from "@/fetch/dq-fetch";
import { getRecordData } from "@/fetch/redcap-fetch";
import { initializeBaselineCounters,	processBaselineRecord } from '@/fetch/mgmt-complete-patients';
import { buildDiseaseExtensionTimeline, updateDiseaseExtensionPatients, updateDiseaseExtensionCounters } from '@/fetch/mgmt-disease-extension';
import { initializeFollowupStats, buildStatusTimeline, buildTimelineSummary, analyzeFollowupCompleteness } from '@/fetch/mgmt-followup';
import { buildUnknownSummary, processUnknownRecord, extractUnknownCodes } from '@/fetch/mgmt-unknown';
import type { REDCapMetadataField, REDCapInstrVsEventsField, REDCapRepeatingsField } from "@/utils/types";


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