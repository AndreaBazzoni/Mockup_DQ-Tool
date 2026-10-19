import { fetchRecords } from "@/fetch/dq-fetch";
import { initializeBaselineCounters,	processBaselineRecord } from '@/fetch/mgmt-complete-patients';
import { buildDiseaseExtensionTimeline, updateDiseaseExtensionPatients, updateDiseaseExtensionCounters, aggregateDiseaseExtensionCounters } from '@/fetch/mgmt-disease-extension';
import { initializeFollowupStats, buildStatusTimeline, buildTimelineSummary, analyzeFollowupCompleteness, classifyPatients } from '@/fetch/mgmt-followup';
import { buildUnknownSummary, processUnknownRecord, extractUnknownCodes, processMissingRecord } from '@/fetch/mgmt-unknown';
import type { REDCapMetadataField, REDCapInstrVsEventsField, REDCapRepeatingsField, REDCapRecord, DQContext } from "@/utils/types";


export const obtainParamsExcelDQ = async(
  centerUrl: string,
  token: string,
  allRecordData: REDCapRecord[][],
  cohort: string[],
  metadata: REDCapMetadataField[],
  instrumentsVsEvents: REDCapInstrVsEventsField[],
  repeatings: REDCapRepeatingsField[]
) => {
  // Valori che devo ritornare (NON USARE useState!)
  let unknownSummaryState, allTimelineSummaryState, baselineCountersState, aggregatedDiseaseExtensionCountersState;
  let lifeStatusTimelineState, noLifeStatusUnifocalTimelineState, noLifeStatusLocoregionalTimelineState, noLifeStatusSystemicTimelineState;

  try {
    let fetchedRecords = await fetchRecords(centerUrl, token, 'bl_record_id');

    // Vettore per l'esecuzione di record selezionati.
    // Se vuoto, l'esecuzione avviene su tutti i record presenti.
    let whiteRecords: string[] = [];

    const patientNr = fetchedRecords.length;
    console.log("Total nr of patients = " + patientNr);
    
    // Leggo i record estratti per due volte.
    // La prima per gestire tutti i conteggi descrittivi (disease extent, diagnosi per anno, ecc.) e compilare i fogli excel relativi.
    // La seconda per gestire tutti i DQ check e salvarli nel foglio relativo.

    // Estraggo a partire dal data dictionary un elenco delle variabili (con rispettivi instrument ed event).
    // Alle variabili è stato definito un codice numerico corrispondente a "unknown".
    const unknownCodes = extractUnknownCodes(metadata, instrumentsVsEvents, repeatings);
    const missingMetadata = metadata.filter(item =>
      item.field_type !== "descriptive" &&
      item.field_name !== "bl_record_id" &&
      !item.field_name.endsWith("_complete")
    );
    const unknownMatrix = {};
    const missingMatrix = {};
    const allTimeline = [];
    const allPatientClassification = [];

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

    // Processo ogni record la prima volta per le variabili accessorie
    for (let i = 0; i < cohort.length; i++) {
      // Per limitare esecuzione a record selezionati
      if (whiteRecords && (whiteRecords.length === 0 || whiteRecords.includes(cohort[i]))) {
        const context: DQContext = {
          'data': allRecordData[i],
          'metadata': metadata,
          'instrumentsVsEvents': instrumentsVsEvents,
          'repeatingInstrumentsAndEvents': repeatings
        };
        processMissingRecord(context, allRecordData[i], missingMetadata, missingMatrix);

        const timeline = buildStatusTimeline(cohort[i], allRecordData[i]);
        allTimeline.push(...timeline);

        const patientClassification = classifyPatients(cohort[i], allRecordData[i]);
        allPatientClassification.push(...patientClassification);
        
        const diseaseExtensionTimeline = buildDiseaseExtensionTimeline(cohort[i], allRecordData[i], baselineDiseaseExtensionMap);
        updateDiseaseExtensionPatients(diseaseExtensionPatients, diseaseExtensionTimeline);
        updateDiseaseExtensionCounters(diseaseExtensionCounters, diseaseExtensionTimeline);
        
        processBaselineRecord(allRecordData[i], baselineCounters);
        analyzeFollowupCompleteness(allRecordData[i], followupStats);

        processUnknownRecord(cohort[i], allRecordData[i], unknownCodes, unknownMatrix);
      }
    }

    // Mappa di associazione record -> allPatientClassification (velocità maggiore)
    const classificationByRecord = new Map(
      allPatientClassification.map(p => [p.record, p])
    );

    const lifeStatusTimeline = [];
    const noLifeStatusUnifocalTimeline = [];
    const noLifeStatusLocoregionalTimeline = [];
    const noLifeStatusSystemicTimeline = [];

    // Ciclo su Timeline per calcolare le variabili legate al Life Status
    for (const item of allTimeline) {
      const classification = classificationByRecord.get(item.record);
      if (!classification) {
        continue;
      }
      // LIFE STATUS UPDATE
      if (classification.hasLifeStatusUpdate) {
        lifeStatusTimeline.push(item);
        continue;
      }
      // NESSUN LIFE STATUS UPDATE:
        // classifico in base all'ultima disease row
      if (classification.lastDiseaseCategory === "unifocal") {
        noLifeStatusUnifocalTimeline.push(item);
      }
      if (classification.lastDiseaseCategory === "locoregional") {
        noLifeStatusLocoregionalTimeline.push(item);
      }
      if (classification.lastDiseaseCategory === "systemic_metastases") {
        noLifeStatusSystemicTimeline.push(item);
      }
    }

    const unknownSummary = buildUnknownSummary(unknownMatrix);
    unknownSummaryState = unknownSummary;

    const allTimelineSummary = buildTimelineSummary(allTimeline);
    allTimelineSummaryState = allTimelineSummary;

    baselineCountersState = baselineCounters;

    const aggregatedDiseaseExtensionCounters = aggregateDiseaseExtensionCounters(diseaseExtensionCounters);
    aggregatedDiseaseExtensionCountersState = aggregatedDiseaseExtensionCounters;

    lifeStatusTimelineState = lifeStatusTimeline;
    noLifeStatusUnifocalTimelineState = noLifeStatusUnifocalTimeline;
    noLifeStatusLocoregionalTimelineState = noLifeStatusLocoregionalTimeline;
    noLifeStatusSystemicTimelineState = noLifeStatusSystemicTimeline;
  }
    
  catch (err) {
    console.error("Failed to obtain parameters of Data Quality: ", err);
    throw new Error("Failed to obtain parameters of Data Quality.");
  } 
    
  finally {
    return {unknownSummaryState, allTimelineSummaryState, baselineCountersState, aggregatedDiseaseExtensionCountersState, lifeStatusTimelineState, noLifeStatusUnifocalTimelineState, noLifeStatusLocoregionalTimelineState, noLifeStatusSystemicTimelineState};
  }
}
