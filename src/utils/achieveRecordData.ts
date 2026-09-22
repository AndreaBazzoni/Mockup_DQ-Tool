import { getRecordData } from "@/fetch/redcap-fetch";
import type { REDCapRecord } from "@/utils/types";

export const achieveRecordData = async (
  centerUrl: string,
  token: string,
  cohort: string[]
): Promise<REDCapRecord[][] | null> => {
  let recordDataTotal: REDCapRecord[][] = [];

  try {
    // Process each record
    for (const recordId of cohort) {
      let recordData = await getRecordData(centerUrl, token, recordId);
      recordDataTotal.push(recordData);
    }
    return recordDataTotal;

  } catch (err: any) {
    console.log("Failed to fetch data: ", err);
    return null;
  }
}

// Versione con Promise.all (più veloce, ma più instabile)
/*
export const achieveRecordData = async (centerUrl: string, token: string, cohort: string[]) => {
  try {
    const recordDataTotal = await Promise.all(
      cohort.map((recordId) => getRecordData(centerUrl, token, recordId))
    );
    return recordDataTotal;

  } catch (err: any) {
    console.log("Failed to fetch data: ", err);
    return null;
  }
};
*/
