import type { REDCapRecord } from "@/utils/types";


// Funzione per inizializzare la Baseline Counters
export function initializeBaselineCounters() {
	return {
		complete2_blank: 0,
		complete2_1: 0,
		complete2_2: 0,
		complete2_3: 0,
		complete0_blank: 0,
		complete0_1: 0,
		complete0_2: 0,
		complete0_3: 0,
	};
}


// Funzione per processare la Baseline
export function processBaselineRecord(recordData: REDCapRecord[], baselineCounters: any) {
  const baselineRow = recordData.find(
    (row) =>
      row.redcap_event_name === "baseline_arm_1" &&
      row.redcap_repeat_instrument === ""
  );

  if (!baselineRow) {
    return;
  }

  const complete = baselineRow.baseline_and_treatment_at_first_presentation_complete;
  const disExt = baselineRow.bl_dis_ext;

  // complete = 2
  if (complete === "2") {
    if (disExt === "") baselineCounters.complete2_blank++;
    if (disExt === "1") baselineCounters.complete2_1++;
    if (disExt === "2") baselineCounters.complete2_2++;
    if (disExt === "3") baselineCounters.complete2_3++;
  }

  // complete = 0
  if (complete === "0") {
    if (disExt === "") baselineCounters.complete0_blank++;
    if (disExt === "1") baselineCounters.complete0_1++;
    if (disExt === "2") baselineCounters.complete0_2++;
    if (disExt === "3") baselineCounters.complete0_3++;
  }
}
