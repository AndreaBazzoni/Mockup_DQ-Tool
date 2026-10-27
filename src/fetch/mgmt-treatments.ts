function getBaselineRow(
  recordData: any
) {
  return recordData.find(
    (row: any) =>
      row.redcap_event_name === "baseline_arm_1" &&
      row.redcap_repeat_instrument === ""
  );
}


function isSelected(
  value: any
) {
  return value === "1" || value === 1;
}


function isNotSelected(
  value: any
) {
  return value === "0" || value === 0;
}


function calculateDistribution(
  records: any,
  field: any,
  options: any
) {
  const total = records.length;

  return options.map((option: any) => {
    const count = records.filter(
        (row: any) => String(row[field] ?? "") === option.value
    ).length;

    return {
      label: option.label,
      count,
      percentage: total > 0
        ? Math.round((count / total) * 100)
        : 0,
    };
  });
}


export function calculateTreatmentSummary(
  allRecordData: any
) {
  const baselineRows = Object.values(allRecordData)
    .map(getBaselineRow)
    .filter(
      (row) =>
        row &&
        row.baseline_and_treatment_at_first_presentation_complete === "2"
    );

  const totalRecords = Object.keys(allRecordData).length;
  const completeCount = baselineRows.length;

  const completeBaselinePercentage = totalRecords > 0
    ? Math.round((completeCount / totalRecords) * 100)
    : 0;

  const sex = calculateDistribution(
    baselineRows,
    "bl_gender",
    [
      { value: "1", label: "M" },
      { value: "2", label: "F" },
    ]
  );

  const ages = baselineRows
    .map((row) => row.bl_123_age_diag_man)
    .filter(
      (value) =>
        value !== "" &&
        value !== null &&
        value !== undefined &&
        Number.isFinite(Number(value))
    )
    .map(Number);

  const averageAge = ages.length > 0
    ? ages.reduce((sum, age) => sum + age, 0) / ages.length
    : null;

  const stage = calculateDistribution(
    baselineRows,
    "bl_dis_ext",
    [
      { value: "1", label: "Unifocal" },
      { value: "2", label: "Locoregional" },
      { value: "3", label: "Metastatic" },
    ]
  );

  const treatmentDefinitions = [
    {
      label: "Surgery / ablative technique alone",
      matches: (row: any) =>
        (
          isSelected(row.bl_123_surg_yn) ||
          isSelected(row.bl_123_abla_yn)
        ) &&
        isNotSelected(row.bl_123_sys_ther_yn) &&
        isNotSelected(row.bl_123_radio_yn),
    },
    {
      label: "Preoperative radiotherapy + surgery",
      matches: (row: any) =>
        row.bl_1_radio_set === "1" &&
        isSelected(row.bl_123_surg_yn),
    },
    {
      label: "Surgery + postoperative radiotherapy",
      matches: (row: any) =>
        row.bl_1_radio_set === "2" &&
        isSelected(row.bl_123_surg_yn),
    },
    {
      label: "Preoperative medical therapy + surgery / ablative technique",
      matches: (row: any) =>
        row.bl_123_sys_ther_set === "1" &&
        (
          isSelected(row.bl_123_surg_yn) ||
          isSelected(row.bl_123_abla_yn)
        ),
    },
    {
      label: "Surgery + adjuvant medical therapy",
      matches: (row: any) =>
        isSelected(row.bl_123_surg_yn) &&
        row.bl_123_sys_ther_set === "2",
    },
    {
      label: "Medical therapy alone",
      matches: (row: any) =>
        isSelected(row.bl_123_sys_ther_yn) &&
        isNotSelected(row.bl_123_surg_yn) &&
        isNotSelected(row.bl_123_radio_yn) &&
        isNotSelected(row.bl_123_abla_yn),
    },
    {
      label: "Radiotherapy alone",
      matches: (row: any) =>
        isSelected(row.bl_123_radio_yn) &&
        isNotSelected(row.bl_123_surg_yn) &&
        isNotSelected(row.bl_123_sys_ther_yn) &&
        isNotSelected(row.bl_123_abla_yn),
    },
    {
      label: "Surveillance",
      matches: (row: any) =>
        isSelected(row.bl_123_surv_yn),
    },
  ];

  const treatments = treatmentDefinitions.map((definition) => {
    const count = baselineRows.filter(definition.matches).length;

    return {
      label: definition.label,
      count,
      percentage: completeCount > 0
        ? Math.round((count / completeCount) * 100)
        : 0,
    };
  });

  return {
    totalRecords,
    completeCount,
    completeBaselinePercentage,
    sex,
    averageAge,
    stage,
    treatments,
  };
}


export function buildTreatmentSummarySheet(
  summary: any
) {
  if (!summary) {
    return [["No treatment summary available"]];
  }

  const formatDistribution = (items: any) =>
    items.map(
      (item: any) => `${item.label} = ${item.percentage}% (${item.count})`
    ).join("    ");

    return [
      ["Number of patients with complete baseline", "", `${summary.completeCount} (${summary.completeBaselinePercentage}%)`],

      ["", "", ""],

      ["Distribution at diagnosis", "", ""],
      ["Sex", "", formatDistribution(summary.sex)],
      ["Average Age", "", summary.averageAge === null
          ? "N/A"
          : Number(summary.averageAge.toFixed(1))],
      ["Stage at diagnosis (unifocal, locoregional, metastatic)", "", formatDistribution(summary.stage)],

      ["", "", ""],

      ["Distribution of treatment combinations", "", ""],
      ["", "", ""],
      ["Baseline", "", "- surgery / ablative technique alone"],
      ["", "", summary.treatments[0].count + " (" + summary.treatments[0].percentage + "%)"],
      ["", "", "- preoperative radiotherapy + surgery"],
      ["", "", summary.treatments[1].count + " (" + summary.treatments[1].percentage + "%)"],
      ["", "", "- surgery + postoperative radiotherapy"],
      ["", "", summary.treatments[2].count + " (" + summary.treatments[2].percentage + "%)"],
      ["", "", "- preoperative medical therapy + surgery / ablative technique"],
      ["", "", summary.treatments[3].count + " (" + summary.treatments[3].percentage + "%)"],
      ["", "", "- surgery + adjuvant medical therapy"],
      ["", "", summary.treatments[4].count + " (" + summary.treatments[4].percentage + "%)"],
      ["", "", "- medical therapy alone"],
      ["", "", summary.treatments[5].count + " (" + summary.treatments[5].percentage + "%)"],
      ["", "", "- radiotherapy alone"],
      ["", "", summary.treatments[6].count + " (" + summary.treatments[6].percentage + "%)"],
      ["", "", "- surveillance"],
      ["", "", summary.treatments[7].count + " (" + summary.treatments[7].percentage + "%)"],
  ];
}
