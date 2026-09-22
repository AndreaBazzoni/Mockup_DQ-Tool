import * as XLSX from 'xlsx';
import type { REDCapRecord } from "@/utils/types";


export const createAnonXlsx = (recordData: REDCapRecord[][]) => {
  // CONTROLLA!!!
	console.log("CCCC: ", recordData)
	//recordData è un oggetto che facciamo diventare array di oggetti
 	const rows = Object.values(recordData).flat();
	console.log("DDDD: ", rows)

	// Create a new workbook and a worksheet
	const workbook = XLSX.utils.book_new();
	const worksheet = XLSX.utils.json_to_sheet(rows);

	// Append the worksheet to the workbook
	XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

	// Generate a binary string from the workbook
	const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

	// Create a blob from the binary string
	const dataBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });

	return dataBlob;
}

export function DownloadAnonymizedData(centerName: string, CurrentAnalysis: string, resultAnonymous: REDCapRecord[][]) {
  // Generate a timestamp for the file name
  const now = new Date();
  const dateString = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const hourString = `${String(now.getHours()).padStart(2, '0')}`;
  const minuteString = `${String(now.getMinutes()).padStart(2, '0')}`;
  const secondString = `${String(now.getSeconds()).padStart(2, '0')}`;
  const timestamp = `${dateString}_${hourString}${minuteString}${secondString}`;

  // Construct the file name
  const fileName = `${centerName}_${CurrentAnalysis}_${timestamp}.xlsx`;

  // Creation of the Blob (Binary Large Object)
  const dataBlob = createAnonXlsx(resultAnonymous);

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
