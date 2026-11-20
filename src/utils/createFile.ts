import { dqChecks } from '@/utils/config-dqchecks';
import { buildTimelineSummary } from '@/fetch/mgmt-followup';
import type { REDCapRecord, DQRecord, REDCapMetadataField } from "@/utils/types";
import { buildTreatmentSummarySheet } from "@/fetch/mgmt-treatments";


// Create generic .txt file
export const createTxtFile = (
  ids: string[],
  fileName: string
): File => {
  const content = ids.join("\n");
  return new File([content], fileName, { type: "text/plain" });
};


// Create generic .xlsx file
export const createXlsxFile = async(
  allRecordData: REDCapRecord[][]
) => {
  // Load xlsx only when used.
  const XLSX = await import("xlsx");

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
export const createExcelDQ = async(
  dataQualityResults: Record<string, DQRecord>,
  metadata: REDCapMetadataField[],
  unknownSummary: any,
  allTimelineSummary: any,
  baselineCounters: any,
  aggregatedDiseaseExtensionCounters: any,
  treatmentSummaryState: any
) => {
    // Load xlsx only when used.
  const XLSX = await import("xlsx");

	const workbook = XLSX.utils.book_new();

	const completePatientsSheet = buildCompletePatientsSheet(baselineCounters);
	const completePatientsWs = XLSX.utils.aoa_to_sheet(completePatientsSheet);
	XLSX.utils.book_append_sheet(workbook,completePatientsWs,"complete patients");

  const treatmentSheet = buildTreatmentSummarySheet(treatmentSummaryState);
	const treatmentWs = XLSX.utils.aoa_to_sheet(treatmentSheet);
	XLSX.utils.book_append_sheet(workbook,treatmentWs,"treatments");

  const diseaseExtensionSheet = buildDiseaseExtensionSheet(aggregatedDiseaseExtensionCounters);
	const diseaseExtensionWs = XLSX.utils.aoa_to_sheet(diseaseExtensionSheet);
	XLSX.utils.book_append_sheet(workbook, diseaseExtensionWs, "disease extension");

	const unknownSheet = buildUnknownSheet(unknownSummary);
	const unknownWs = XLSX.utils.aoa_to_sheet(unknownSheet);
	XLSX.utils.book_append_sheet(workbook, unknownWs, "missing & unknown");

	const followUpSheet = buildFollowUpSheet(allTimelineSummary);
	const followUpWs = XLSX.utils.aoa_to_sheet(followUpSheet);
	XLSX.utils.book_append_sheet(workbook,followUpWs,"follow-up");

  const checksRows = transformDataForDQ(dataQualityResults, metadata);
	const checksWorksheet = XLSX.utils.aoa_to_sheet(checksRows);
	XLSX.utils.book_append_sheet(workbook, checksWorksheet, "checks");

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  return new Blob([excelBuffer], { type: 'application/octet-stream' });
};


const transformDataForDQ = (
  data: Record<string, DQRecord>,
  metadata: REDCapMetadataField[]
) => {
  const allRecordNames = Object.keys(data);

	if (!allRecordNames.length) return [];

	// Mantengo solo i record che hanno almeno un controllo fallito.
	const recordNames = allRecordNames.filter(recordId => {
		return Object.values(data[recordId]).some((value: any) =>
			value === false || (typeof value === "number" && value > 0)
		);
	});

  if (!recordNames.length) return [];

  const checksMap = Object.fromEntries(
    dqChecks.map(check => [check.name, check])
  );

  const checks = dqChecks.map(c => c.name);

  // Maximum number of variables across all controls.
  const maxVars = Math.max(
    ...dqChecks.map(c => c.vars?.length || 0),
    0
  );

  // Unique heading among all the controls.
  const variableHeaders = Array.from(
    { length: maxVars },
    (_, i) => [
      `Instrument ${i + 1}`,
      `Variable to check ${i + 1}`
    ]
  ).flat();

  const rows: (string | number)[][] = [[
    "Data quality check",
    ...variableHeaders,
    ...recordNames,
    "TOTAL"
  ]];

  checks.forEach(check => {
    const values = recordNames.map(rec => {
      const key = getResultKey(check, data[rec]);
      return key ? data[rec][key] : 0;
    });

    const metadataCheck= checksMap[check];

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
      ...Array(maxVars - vars.length).fill(null)
    ];

    const variableColumns = paddedVars.flatMap(v => {
      if (!v) return ["", ""];
      return [
        v.instrument,
        v.variable
      ];
    });

    const checkLabel = metadataCheck?.desc || check;

    const row = [
      checkLabel,
      ...variableColumns,
      ...values.map(val => {
        if (val === true || val === 0 || val == null) return "";
        if (val === false) return 1;
        return val;
      }),
      values.reduce((total, val) => {
        if (val === false) return total + 1;
        if (typeof val === "number" && Number.isFinite(val)) {
          return total + val;
        }
        return total;
      }, 0)
    ];

    // I filter the records: if the check doesn't fail for any of them, I don't include it in the list.
    if (row[row.length - 1] > 0) {
      rows.push(row);
    }
  });

  // At the end, I report the column totals and the sum of the row totals.
  const totalsRow = [
    "TOTAL",
    ...variableHeaders.map(() => ""),
    ...recordNames.map((_, i) =>
      rows.slice(1).reduce((total, row) => {
        const value = row[1 + variableHeaders.length + i];
        return total + (typeof value === "number" ? value : 0);
      }, 0)
    ),
    rows.slice(1).reduce((total, row) => {
      const value = row[row.length - 1];
      return total + (typeof value === "number" ? value : 0);
    }, 0)
  ];

  rows.push(totalsRow);

  return rows;
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
		["", "BASELINE", ""],
		["form status", "Description", "patients"],
		[
			"complete",
			"unselected (disease extension)",
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
			"unselected (disease extension)",
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
      "Form name",
			"denominator",
			"% missing",
			"% unknown"
		]
	];
	unknownSummary
		// Last filter: I keep only the variables that have at least one missing or one unknown value.
    /*
		.filter((item: any) =>
			item.percentMissing > 0 ||
			item.percentUnknown > 0
		)
    */
    .filter((item: any) => item.denominatorMissing > 0)
		.forEach((item: any) => {
			rows.push([
				item.field,
        item.formName,
				item.denominatorMissing,
				//Math.round(item.percentMissing * 10) / 10,
				//Math.round(item.percentMissing),
				`${Math.round(item.percentMissing)} %`,
				//Math.round(item.percentUnknown * 10) / 10
				//Math.round(item.percentUnknown),
				`${Math.round(item.percentUnknown)} %`
			]);
		});
	return rows;
};


const buildFollowUpSheet = (
  allTimeline: any[],
) => {
  const rows = [];

  // I select the last global status for each patient.
  const latestGlobalTimeline = getLatestStatusByPatient(allTimeline);

  // GENERAL
  rows.push(
    ...buildFollowUpTable(
      buildTimelineSummary(latestGlobalTimeline),
      "GENERAL (disease extension follow-ups)"
    )
  );

  rows.push([]);

  // LIFE STATUS UPDATE
  const latestLifeStatusTimeline = latestGlobalTimeline.filter(
    item => item.tipoRow === "life_status_update"
  );
  rows.push(
    ...buildFollowUpTable(
      buildTimelineSummary(latestLifeStatusTimeline),
      "LIFE STATUS form"
    )
  );

  return rows;
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
    "1": "NED",
    "2": "AWD",
    "3": "Dead",
    "4": "Dead",
    "NA": "NA"
  };

  const diagnosisYears = [
    ...new Set(timelineSummary.map((d: any) => d.diagnosisYear))
  ].sort((a, b) => {
    if (a === "NA") return 1;
    if (b === "NA") return -1;
    return String(a).localeCompare(String(b));
  });

	const statusLabels = [
		"AWD",
		"NED",
		"Dead",
		...(timelineSummary.some((d: any) =>
      (STATUS_LABEL_MAP[d.status] || "NA") === "NA"
		) ? ["NA"] : [])
	];

  // ANNI DI FOLLOW-UP. Faccio in modo che siano tutti per tutti gli stati.
	const allFollowUpYears = [
		...new Set<string>(timelineSummary.map((d: any) =>
      d.statusYear)
    )
	].sort((a, b) => {
		if (a === "NA") return 1;
		if (b === "NA") return -1;
		return String(a).localeCompare(String(b));
	});

  const followUpYearsByStatus: Record<string, typeof allFollowUpYears> = {};

  statusLabels.forEach(statusLabel => {
		followUpYearsByStatus[statusLabel] = allFollowUpYears;
	});

  const rows = [];

  // ============================================================
  // TITLE
  // ============================================================
  const titleRow = [title, ""];

  for (const statusLabel of statusLabels) {
    if (statusLabel === "NED") {
      titleRow.push("Life status by FUP year");
      break;
    }
    titleRow.push(
      ...Array(followUpYearsByStatus[statusLabel].length).fill("")
    );
  }

  rows.push(titleRow);

  // ============================================================
  // HEADER STATUS
  // ============================================================

  // First Header
  const firstHeaderRow = ["", ""];
  for (const statusLabel of statusLabels) {
		firstHeaderRow.push(statusLabel);
		for (let i = 1; i < followUpYearsByStatus[statusLabel].length; i++) {
			firstHeaderRow.push("");
		}
	}

  rows.push(firstHeaderRow);

  // Second Header
	const secondHeaderRow = ["", "Diagnosis year"];
  statusLabels.forEach(statusLabel => {
    secondHeaderRow.push(
      ...followUpYearsByStatus[statusLabel]
    );
  });

  rows.push(secondHeaderRow);

  // ============================================================
  // DATA
  // ============================================================
  for (const diagnosisYear of diagnosisYears) {
    const row = ["", diagnosisYear];

    statusLabels.forEach(statusLabel => {
      followUpYearsByStatus[statusLabel].forEach(followUpYear => {
        const count = timelineSummary.filter((item: any) =>
          (STATUS_LABEL_MAP[item.status] || "NA") === statusLabel &&
          item.diagnosisYear === diagnosisYear &&
          item.statusYear === followUpYear
        )
        .reduce((sum: any, item: any) => sum + item.count, 0);

        row.push(count || "");
      });
    });

    rows.push(row);
  }

  return rows;
};


const getLatestStatusByPatient = (
  timeline: any[]
) => {
  const latestByPatient = new Map();

  for (const item of timeline) {
    if (!item.statusDate) continue;

    const itemDate = new Date(item.statusDate);

    if (isNaN(itemDate.getTime())) continue;

    const current = latestByPatient.get(item.record);

    if (!current) {
      latestByPatient.set(item.record, item);
      continue;
    }

    const currentDate = new Date(current.statusDate);

    if (itemDate > currentDate) {
      latestByPatient.set(item.record, item);
    }
  }

  return Array.from(latestByPatient.values());
};
