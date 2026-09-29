import * as XLSX from 'xlsx';
import { dqChecks } from '@/utils/config-dqchecks';
import type { REDCapRecord, DQRecord, REDCapMetadataField } from "@/utils/types";


// Create generic .txt file
export const createTxtFile = (
  ids: string[],
  fileName: string
): File => {
  const content = ids.join("\n");
  return new File([content], fileName, { type: "text/plain" });
};


// Create generic .xlsx file
export const createXlsxFile = (
  recordData: REDCapRecord[][]
) => {
  // recordData è un oggetto che facciamo diventare array di oggetti
  const rows = Object.values(recordData).flat();

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


// Create Excel file fot DQ
export const createExcelDQ = (
  dataQualityResults: Record<string, DQRecord>,
  metadata: REDCapMetadataField[],
  unknownSummary: any,
  timelineSummary: any,
  baselineCounters: any,
  diseaseExtensionCounters: any
) => {
	const workbook = XLSX.utils.book_new();

	const DQ_SHEET_NAMES = {
		dq_1: "baseline",
		dq_2: "unifocal fu",
		dq_3: "unifocal local recurrence",
		dq_4: "unifocal distant metastasis",
		dq_5: "locoregional fu",
		dq_6: "locoregional progression",
		dq_7: "sys met fu",
		dq_8: "sys met progression",
		dq_9: "life status update"
	};

	// Get grouped sheets: { dq_1: [...rows], dq_2: [...rows], ... }
	const groupedSheets = transformDataForDQ2(dataQualityResults, metadata);

  Object.entries(groupedSheets).forEach(([dqGroup, rows]) => {
      // Use the mapping to name the sheets
      const sheetName = DQ_SHEET_NAMES[dqGroup] || dqGroup;
      const worksheet = XLSX.utils.aoa_to_sheet(rows);
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  });

  //const missingSheet = buildMissingSheet(dataQualityResults);
  //const missingWs = XLSX.utils.aoa_to_sheet(missingSheet);
  //XLSX.utils.book_append_sheet(workbook, missingWs, "missing");

	const completePatientsSheet = buildCompletePatientsSheet(baselineCounters);
	const completePatientsWs = XLSX.utils.aoa_to_sheet(completePatientsSheet);
	XLSX.utils.book_append_sheet(workbook,completePatientsWs,"complete patients");

	const unknownSheet = buildUnknownSheet(unknownSummary);
	const unknownWs = XLSX.utils.aoa_to_sheet(unknownSheet);
	XLSX.utils.book_append_sheet(workbook, unknownWs, "unknown");

	const followUpSheet = buildFollowUpSheet(timelineSummary);
	const followUpWs = XLSX.utils.aoa_to_sheet(followUpSheet);
	XLSX.utils.book_append_sheet(workbook,followUpWs,"follow-up");

	const diseaseExtensionSheet = buildDiseaseExtensionSheet(diseaseExtensionCounters);
	const diseaseExtensionWs = XLSX.utils.aoa_to_sheet(diseaseExtensionSheet);
	XLSX.utils.book_append_sheet(workbook, diseaseExtensionWs, "disease extension vs diag yr");

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  return new Blob([excelBuffer], { type: 'application/octet-stream' });
};


const transformDataForDQ2 = (data: Record<string, DQRecord>, metadata: REDCapMetadataField[]) => {
	const recordNames = Object.keys(data);
	if (!recordNames.length) return {};

	const checksMap = Object.fromEntries(
		dqChecks.map(check => [check.name, check])
	);
	const checks = dqChecks.map(c => c.name);
	const grouped: Record<string, { maxVars: number; rows: (string | number)[][] }> = {};

	checks.forEach(check => {
		const dqGroup = check.match(/^dq_\d+/)?.[0] || "other";
		if (!grouped[dqGroup]) {
			const groupChecks = dqChecks.filter(
				c => c.name.startsWith(dqGroup + "_")
			);
			const maxVars = Math.max(
				...groupChecks.map(c => c.vars?.length || 0),
				0
			);
			const variableHeaders = Array.from(
				{ length: maxVars },
				(_, i) => [
					`Instrument ${i + 1}`,
					`Variable to check ${i + 1}`
				]
			).flat();
			grouped[dqGroup] = {
				maxVars,
				rows: [[
					"Data quality check",
					...variableHeaders,
					...recordNames,
					"TOTAL"
				]]
			};
		}
		const values = recordNames.map(rec => {
			const key = getResultKey(check, data[rec]);
			return key ? data[rec][key] : 0;
		});
		const sum = values.reduce(
			(acc, val) => acc + (typeof val === "number" ? val : 0),
			0
		);
		const metadataCheck = checksMap[check];
		let mainVar = metadataCheck?.params?.[0];
		if (Array.isArray(mainVar)) {
			mainVar = mainVar[0];
		}
		const vars = (metadataCheck?.vars || []).map(v => {
			const meta = metadata?.find((m: any) => m.field_name === v);
			return {
				instrument: meta?.form_name?.replace(/_/g, " ") ?? "",
				variable: cleanLabel(
					meta?.field_label ||
					meta?.field_name ||
					v
				)
			};
		});
		const paddedVars = [
			...vars,
			...Array(grouped[dqGroup].maxVars - vars.length).fill(null)
		];
		const variableColumns = paddedVars.flatMap(v => {
			if (!v) {
				return ["", ""];
			}
			return [
				v.instrument,
				v.variable
			];
		});
		const checkLabel = metadataCheck?.desc || check;
		const row = [
			checkLabel,
			...variableColumns,
			...values.map(val => val === 0 ? "" : val),
			sum
		];
		grouped[dqGroup].rows.push(row);
	});

	return Object.fromEntries(
		Object.entries(grouped).map(([group, info]) => [
			group,
			info.rows
		])
	);
};


const getResultKey = (checkName: string, record: Record<string, DQRecord>) => {
  return Object.keys(record).find(
    key => key.startsWith(checkName + " - ")
  );
};


const cleanLabel = (label: string) => {
	if (!label) return "";

	let text = String(label);

	const pMatch = text.match(/<p[^>]*>(.*?)<\/p>/i);
	if (pMatch) {
		text = pMatch[1];
	}

	text = text
		.replace(/<\/?[^>]+(>|$)/g, "")
		.replace(/\s+/g, " ")
		.trim();

	return text;
};
