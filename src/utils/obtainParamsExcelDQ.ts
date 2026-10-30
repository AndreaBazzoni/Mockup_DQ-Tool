import { fetchRecords } from "@/fetch/dq-fetch";
import { initializeBaselineCounters,	processBaselineCompleteness } from '@/fetch/mgmt-complete-patients';
import { buildDiseaseExtensionTimeline, updateDiseaseExtensionPatients, updateDiseaseExtensionCounters, aggregateDiseaseExtensionCounters } from '@/fetch/mgmt-disease-extension';
import { initializeFollowupStats, buildStatusTimeline, buildTimelineSummary, analyzeFollowupCompleteness, classifyPatients } from '@/fetch/mgmt-followup';
import { buildUnknownMissingSummary, processUnknownRecord, extractUnknownCodes, processMissingRecord } from '@/fetch/mgmt-unknown';
import { calculateTreatmentSummary } from '@/fetch/mgmt-treatments';
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
  // Values ​​that I need to return (DO NOT USE useState!)
  let unknownSummaryState, allTimelineSummaryState, baselineCountersState, aggregatedDiseaseExtensionCountersState;
  let lifeStatusTimelineState, noLifeStatusUnifocalTimelineState, noLifeStatusLocoregionalTimelineState, noLifeStatusSystemicTimelineState, treatmentSummaryState;

  try {
    let fetchedRecords = await fetchRecords(centerUrl, token, 'bl_record_id');

    // Vector for the processing of selected records.
    // If empty, processing is performed on all existing records.
    let whiteRecords: string[] = [];

    const patientNr = fetchedRecords.length;
    console.log("Total nr of patients = " + patientNr);
    
    // I process the extracted records twice. 
    // First pass -> for handling all descriptive counts and populating the corresponding Excel sheets.
    // Second pass -> for performing all Data Quality (DQ) checks and saving the results to the relevant sheet.

    // I extract a list of variables (along with their respective instruments and events) from the Data Dictionary.
    // A numeric code corresponding to "unknown" has been defined for these variables.
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

    // I initialize the counters for the "complete patients" sheet (counts of disease extensions).
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

    // I process each record the first time for the auxiliary variables.
    for (let i = 0; i < cohort.length; i++) {
      // To limit execution to selected record.
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
        processBaselineCompleteness(allRecordData[i], baselineCounters);
        analyzeFollowupCompleteness(allRecordData[i], followupStats);
        processUnknownRecord(cohort[i], allRecordData[i], unknownCodes, unknownMatrix);
      }
    }

    // "Record -> allPatientClassification" association map (more speed)
    const classificationByRecord = new Map(
      allPatientClassification.map(p => [p.record, p])
    );
    const lifeStatusTimeline = [];
    const noLifeStatusUnifocalTimeline = [];
    const noLifeStatusLocoregionalTimeline = [];
    const noLifeStatusSystemicTimeline = [];

    // Loop through the Timeline to calculate variables related to Life Status
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
      // NO LIFE STATUS UPDATE:
        // Classification about the last disease row.
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

    const unknownSummary = buildUnknownMissingSummary(unknownMatrix, missingMatrix, metadata);
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

    const treatmentSummary = calculateTreatmentSummary(allRecordData);
    treatmentSummaryState = treatmentSummary;
  }
    
  catch (err) {
    console.error("Failed to obtain parameters of Data Quality: ", err);
    throw new Error("Failed to obtain parameters of Data Quality.");
  } 
    
  finally {
    return {unknownSummaryState, allTimelineSummaryState, baselineCountersState, aggregatedDiseaseExtensionCountersState, lifeStatusTimelineState, noLifeStatusUnifocalTimelineState, noLifeStatusLocoregionalTimelineState, noLifeStatusSystemicTimelineState, treatmentSummaryState};
  }
}
