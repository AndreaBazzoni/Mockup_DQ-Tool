import * as XLSX from 'xlsx';
import { dqChecks } from '@/utils/config-dqchecks';
import { buildTimelineSummary } from '@/fetch/mgmt-followup';
import type { REDCapRecord, DQRecord, REDCapMetadataField } from "@/utils/types";


// Life Status Type
interface lifeStatusType {
  record: string;
  diagnosisYear: any;
  statusYear: any;
  status: any;
  instrument: any;
  event: any;
  tipoRow: any;
}


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
  allRecordData: REDCapRecord[][]
) => {
  // allRecordData is an Object that becomes an Object Array.
  const rows = Object.values(allRecordData).flat();

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
  allTimelineSummary: any,
  baselineCounters: any,
  aggregatedDiseaseExtensionCounters: any,
  lifeStatusTimeline: lifeStatusType[] | undefined,
  noLifeStatusUnifocalTimeline: lifeStatusType[] | undefined,
  noLifeStatusLocoregionalTimeline: lifeStatusType[] | undefined,
  noLifeStatusSystemicTimeline: lifeStatusType[] | undefined
) => {
	const workbook = XLSX.utils.book_new();

	const DQ_SHEET_NAMES: Record<string, string> = {
		dq_1: "dq checks",
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

	const followUpSheet = buildFollowUpSheet(allTimelineSummary, lifeStatusTimeline, noLifeStatusUnifocalTimeline, noLifeStatusLocoregionalTimeline, noLifeStatusSystemicTimeline);
	const followUpWs = XLSX.utils.aoa_to_sheet(followUpSheet);
	XLSX.utils.book_append_sheet(workbook,followUpWs,"follow-up");

	const diseaseExtensionSheet = buildDiseaseExtensionSheet(aggregatedDiseaseExtensionCounters);
	const diseaseExtensionWs = XLSX.utils.aoa_to_sheet(diseaseExtensionSheet);
	XLSX.utils.book_append_sheet(workbook, diseaseExtensionWs, "disease extension vs diag yr");

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  return new Blob([excelBuffer], { type: 'application/octet-stream' });
};


const transformDataForDQ2 = (
  data: Record<string, DQRecord>,
  metadata: REDCapMetadataField[]
) => {
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
    /*
		const sum = values.reduce(
			(acc, val) => acc + (typeof val === "number" ? val : 0),
			0
		);
    */
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
    /*
		const row = [
			checkLabel,
			...variableColumns,
			...values.map(val => val === 0 ? "" : val),
			sum
		];
    */
    const row = [
			checkLabel,
			...variableColumns,
			...values.map(val => {
				if (val === true) return "";
				if (val === false) return 1;
				if (val === 0) return "";
				return val;
			}),
			values.filter(val => val === false).length
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


const getResultKey = (
  checkName: string,
  record: Record<string, DQRecord>
) => {
  return Object.keys(record).find(
    key => key.startsWith(checkName + " - ")
  );
};


const cleanLabel = (
  label: string
) => {
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


function buildCompletePatientsSheet(
  baselineCounters: any
) {
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


/*
const buildUnknownSheet = (
  unknownSummary: any
) => {
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
*/
const buildUnknownSheet = (
  unknownSummary: any
) => {
	const rows = [
		[
			"variable",
			"denominator missing",
			"% missing",
			"denominator unknown",
			"% unknown"
		]
	];
	unknownSummary
		// Last filter: I keep only the variables that have at least one missing or one unknown value.
		.filter((item: any) =>
			item.percentMissing > 0 ||
			item.percentUnknown > 0
		)
		.forEach((item: any) => {
			rows.push([
				item.field,
				item.denominatorMissing,
				Math.round(item.percentMissing * 10) / 10,
				item.denominator,
				Math.round(item.percentUnknown * 10) / 10
			]);
		});
	return rows;
};


const buildFollowUpSheet = (
  allTimelineSummary: any,
  lifeStatusTimeline: lifeStatusType[] | undefined,
  noLifeStatusUnifocalTimeline: lifeStatusType[] | undefined,
  noLifeStatusLocoregionalTimeline: lifeStatusType[] | undefined,
  noLifeStatusSystemicTimeline: lifeStatusType[] | undefined
) => {
  const rows = [];

  // ============================================================
  // GENERAL
  // ============================================================
  rows.push(
    ...buildFollowUpTable(
      buildTimelineSummary(allTimelineSummary),
      "GENERAL"
    )
  );

  rows.push([]);

  // ============================================================
  // LIFE STATUS UPDATE
  // ============================================================
  rows.push(
    ...buildFollowUpTable(
      buildTimelineSummary(lifeStatusTimeline),
      "LIFE STATUS UPDATE"
    )
  );

  rows.push([]);

  // ============================================================
  // NO LIFE STATUS - UNIFOCAL
  // ============================================================
  rows.push(
    ...buildFollowUpTable(
      buildTimelineSummary(noLifeStatusUnifocalTimeline),
      "NO LIFE STATUS UPDATE - UNIFOCAL"
    )
  );

  rows.push([]);

  // ============================================================
  // NO LIFE STATUS - LOCOREGIONAL
  // ============================================================
  rows.push(
    ...buildFollowUpTable(
      buildTimelineSummary(noLifeStatusLocoregionalTimeline),
      "NO LIFE STATUS UPDATE - LOCOREGIONAL"
    )
  );

  rows.push([]);

  // ============================================================
  // NO LIFE STATUS - SYSTEMIC METASTASES
  // ============================================================
  rows.push(
    ...buildFollowUpTable(
      buildTimelineSummary(noLifeStatusSystemicTimeline),
      "NO LIFE STATUS UPDATE - SYSTEMIC METASTASES"
    )
  );

  return rows;

  // This is for mapping the separate "dead" entries in the follow-up table:
	/*
	const STATUS_LABEL_MAP = {
		"1": "Alive: no evidence of disease (NED)",
		"2": "Alive with disease (AWD)",
		"3": "Dead: no evidence of disease",
		"4": "Dead: evidence of disease"
	};
	const STATUS_LABEL_MAP: Record<string, string> = {
		"1": "Alive: no evidence of disease (NED)",
		"2": "Alive with disease (AWD)",
		"3": "Dead",
		"4": "Dead"
	};
  */
 /*
	const diagnosisYears = [...new Set(
		allTimelineSummary.map((d: any) => d.diagnosisYear)
	)].sort();
	const followUpYears = [...new Set(
		allTimelineSummary.map((d: any) => d.statusYear)
	)].sort();
	// Converto subito status -> label (una sola volta)
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
		allTimelineSummary.map((d: any) =>
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
        / *
        QUESTO FUNZIONA PER MAPPARE DEAD WITH/WITHOUT EVIDENCE OF DISEASE SEPARATI. PERO' INT LI VUOLE AGGREGATI COME 'DEAD'
				const match = allTimelineSummary.find(
					r =>
						(STATUS_LABEL_MAP[r.status] || "Unknown") === statusLabel &&
						r.statusYear === fuYear &&
						r.diagnosisYear === dxYear
				);
				row.push(match ? match.count : "");
        * /
				const count = allTimelineSummary.filter((r: any) =>
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
  */
};


const buildDiseaseExtensionSheet = (
  diseaseExtensionCounters: any
) => {
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
      // Here, I modify the labels only for the objects within the current disease extension, specifically for patients who have no follow-up data and only a baseline record.
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


const buildFollowUpTable = (
  timelineSummary: any,
  title: string
) => {
  const STATUS_LABEL_MAP: Record<string, string> = {
    "1": "Alive: no evidence of disease (NED)",
    "2": "Alive with disease (AWD)",
    "3": "Dead",
    "4": "Dead",
    "NA": "NA"
  };

  const diagnosisYears: string[] = [
    ...new Set<string>(
      timelineSummary
        .map((d: any) => d.diagnosisYear)
        .filter((v: any) => v !== undefined && v !== null)
    )
  ];

  diagnosisYears.sort((a, b) => {
    if (a === "NA") return 1;
    if (b === "NA") return -1;
    return String(a).localeCompare(String(b));
  });

  const statusLabels: string[] = [
    ...new Set<string>(
      timelineSummary.map((d: any) =>
        STATUS_LABEL_MAP[d.status] || "NA"
      )
    )
  ];

  statusLabels.sort((a: any, b: any) => {
    if (a === "NA") return 1;
    if (b === "NA") return -1;
    return a.localeCompare(b);
  });

  const followUpYears = [
    ...new Set(
      timelineSummary
        .map((d: any) => d.statusYear)
        .filter((v: any) => v !== undefined && v !== null)
    )
  ];

  followUpYears.sort((a, b) => {
    if (a === "NA") return 1;
    if (b === "NA") return -1;
    return String(a).localeCompare(String(b));
  });

  const rows = [];

  // ============================================================
  // TITLE
  // ============================================================
  rows.push([title]);

  // ============================================================
  // FIRST ROW - HEADER
  // ============================================================
  const firstHeaderRow = [
    "",
    "Diagnosis year"
  ];

  for (const statusLabel of statusLabels) {
    firstHeaderRow.push(statusLabel);
    for (let i = 1; i < diagnosisYears.length; i++) {
      firstHeaderRow.push("");
    }
  }

  rows.push(firstHeaderRow);

  // ============================================================
  // SECOND ROW - HEADER
  // ============================================================
  const secondHeaderRow = [
    "",
    "Diagnosis FUP"
  ];

  for (const statusLabel of statusLabels) {
    // To avoid an "unused variable" error.
    if (statusLabel === null) {
      console.log("statusLabel = null");
    }
    for (const diagnosisYear of diagnosisYears) {
      secondHeaderRow.push(diagnosisYear);
    }
  }

  rows.push(secondHeaderRow);

  // ============================================================
  // DATA
  // ============================================================

  for (const followUpYear of followUpYears) {
    const row = [
      "",
      followUpYear
    ];

    for (const statusLabel of statusLabels) {
      for (const diagnosisYear of diagnosisYears) {
        const count = timelineSummary
          .filter((item: any) =>
            (STATUS_LABEL_MAP[item.status] || "NA") === statusLabel &&
            item.statusYear === followUpYear &&
            item.diagnosisYear === diagnosisYear
          )
          .reduce(
            (sum: any, item: any) => sum + item.count,
            0
          );
        row.push(count || "");
      }
    }

    rows.push(row);
  }

  return rows;
};
