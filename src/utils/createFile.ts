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

	const DQ_SHEET_NAMES: Record<string, string> = {
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


function buildCompletePatientsSheet(baselineCounters: any) {
	return [
		["BASELINE", "", ""],
		["form status", "Description", "patients"],
		[
			"complete",
			"unselected",
			baselineCounters.complete2_blank
		],
		[
			"complete",
			"unifocal",
			baselineCounters.complete2_1
		],
		[
			"complete",
			"locoregional",
			baselineCounters.complete2_2
		],
		[
			"complete",
			"systemic metastases at presentation",
			baselineCounters.complete2_3
		],
		["", "", ""],
		[
			"incomplete",
			"unselected",
			baselineCounters.complete0_blank
		],
		[
			"incomplete",
			"unifocal",
			baselineCounters.complete0_1
		],
		[
			"incomplete",
			"locoregional",
			baselineCounters.complete0_2
		],
		[
			"incomplete",
			"systemic metastases at presentation",
			baselineCounters.complete0_3
		]
	];
}


const buildUnknownSheet = (unknownSummary: any) => {
	const rows = [["variable", "Denominator", "% unknown"]];
	unknownSummary.forEach((item: any) => {
		rows.push([
			item.field,
			item.denominator,
			item.percent
		]);
	});
	return rows;
};


const buildFollowUpSheet = (timelineSummary: any) => {
	/*
	Questo è per mappare i dead separati nella tabella del follow up:
	const STATUS_LABEL_MAP = {
		"1": "Alive: no evidence of disease (NED)",
		"2": "Alive with disease (AWD)",
		"3": "Dead: no evidence of disease",
		"4": "Dead: evidence of disease"
	};
	*/
	const STATUS_LABEL_MAP: Record<string, string> = {
		"1": "Alive: no evidence of disease (NED)",
		"2": "Alive with disease (AWD)",
		"3": "Dead",
		"4": "Dead"
	};
	const diagnosisYears = [...new Set(
		timelineSummary.map((d: any) => d.diagnosisYear)
	)].sort();
	const followUpYears = [...new Set(
		timelineSummary.map((d: any) => d.statusYear)
	)].sort();
	// Converto subito status → label (una sola volta)
	const rows = [];
	// HEADER
	rows.push([
		"",
		"",
		"Diagnosis year"
	]);
	rows.push([
		"Status at follow up",
		"Year follow up",
		...diagnosisYears
	]);
	// Status unici già tradotti in label
	const statusLabels = [...new Set(
		timelineSummary.map((d: any) =>
			STATUS_LABEL_MAP[d.status] || "Unknown"
		)
	)];
	for (const statusLabel of statusLabels) {
		for (const fuYear of followUpYears) {
			const row = [
				statusLabel,
				fuYear
			];
			for (const dxYear of diagnosisYears) {
        /*
        QUESTO FUNZIONA PER MAPPARE DEAD WITH/WITHOUT EVIDENCE OF DISEASE SEPARATI. PERO' INT LI VUOLE AGGREGATI COME 'DEAD'
				const match = timelineSummary.find(
					r =>
						(STATUS_LABEL_MAP[r.status] || "Unknown") === statusLabel &&
						r.statusYear === fuYear &&
						r.diagnosisYear === dxYear
				);
				row.push(match ? match.count : "");
        */
				const count = timelineSummary.filter((r: any) =>
						(STATUS_LABEL_MAP[r.status] || "Unknown") === statusLabel &&
						r.statusYear === fuYear &&
						r.diagnosisYear === dxYear
				).reduce((sum: any, r: any) => sum + r.count, 0);
				row.push(count || "");
			}
			rows.push(row);
		}
	}
	return rows;
};


const buildDiseaseExtensionSheet = (diseaseExtensionCounters: any) => {
  const rows = [
    [
      "Year of diagnosis",
      "Baseline disease extension",
      "Current disease extension",
      "Total N of patients"
    ]
  ];
  if (!diseaseExtensionCounters) {
      return rows;
  }
  Object.values(diseaseExtensionCounters)
    .sort((a: any, b: any) => {
      if (a.diagnosisYear !== b.diagnosisYear) {
        return a.diagnosisYear.localeCompare(b.diagnosisYear);
      }
      if (a.baselineDiseaseExtension !== b.baselineDiseaseExtension) {
        return a.baselineDiseaseExtension.localeCompare(b.baselineDiseaseExtension);
      }
      return a.currentDiseaseExtension.localeCompare(b.currentDiseaseExtension);
    })
    .forEach((item: any) => {
      // Qui modifico le label solo degli oggetti della current disease extension per i pazienti che non hanno un follow up ma solo la baseline registrata.
      const currentDiseaseExtension = item.currentDiseaseExtension.replace(" at presentation"," without follow up");
      rows.push([
        item.diagnosisYear,
        item.baselineDiseaseExtension,
        currentDiseaseExtension,
        item.count
      ]);
    });
  return rows;
};
