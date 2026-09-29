import { createXlsxFile } from "@/utils/createFile";
import { obtainParamsExcelDQ } from "@/utils/obtainParamsExcelDQ";
import type { Center, DQRecord, REDCapMetadataField, REDCapInstrVsEventsField, REDCapRepeatingsField } from "@/utils/types";


export function DownloadDataQuality(
  center: Center,
  token: string,
  metadata: REDCapMetadataField[],
  instrumentsVsEvents: REDCapInstrVsEventsField[],
  repeatings: REDCapRepeatingsField[],
  CurrentAnalysis: string,
  resultAnonymous: Record<string, DQRecord>
) {
  // Generate a timestamp for the file name
  const now = new Date();

  // Anno = presente
  // const dateString = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  // Anno = assente
  const dateString = `${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  const hourString = `${String(now.getHours()).padStart(2, '0')}`;
  const minuteString = `${String(now.getMinutes()).padStart(2, '0')}`;
  const secondString = `${String(now.getSeconds()).padStart(2, '0')}`;

  const timestamp = `${dateString}_${hourString}${minuteString}${secondString}`;

  // Construct the file name
  const fileName = `${CurrentAnalysis}_${center.id}_${timestamp}.xlsx`;

  // Obtain parameters for file building
  const rslt = obtainParamsExcelDQ(center.url, token, metadata, instrumentsVsEvents, repeatings);
  const {unknownSummaryState, timelineSummaryState, baselineCountersState, diseaseExtensionCountersState} = rslt;

  // Creation of the Blob (Binary Large Object)
  const dataBlob = createXlsxFile(resultAnonymous);

  // Create a link element to download the file
  const urlBlob = window.URL.createObjectURL(dataBlob);
  const linkBlob = document.createElement('a');
  linkBlob.href = urlBlob;
  linkBlob.download = fileName;

  // Append the link to the document and trigger a click
  document.body.appendChild(linkBlob);
  linkBlob.click();

  // Clean up
  document.body.removeChild(linkBlob);
  window.URL.revokeObjectURL(urlBlob);
};
