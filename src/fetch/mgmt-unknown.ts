import type { REDCapRecord, REDCapMetadataField, REDCapInstrVsEventsField, REDCapRepeatingsField } from "@/utils/types";


// Funzione per costruire la Unknown Summary
export function buildUnknownSummary(unknownMatrix: any) {
	return Object.values(unknownMatrix).map((row: any) => {
		let denominator = 0;
		let matches = 0;
		for (const key of Object.keys(row)) {
			if (key.startsWith("elig_")) {
				denominator += row[key];
			}
			if (key.startsWith("match_")) {
				matches += row[key];
			}
		}
		return {
			field: row.field,
			denominator,
			percent:
				denominator > 0
					? (matches / denominator) * 100
					: 0,
		};
	});
}


// Funzione che processa gli Unknown Record
export function processUnknownRecord(recordId: string, recordData: REDCapRecord[], unknownCodes: any[], unknownMatrix: any) {
  for (const rowData of recordData) {
    unknownCodes.forEach((codeObj) => {
      const fieldName = codeObj.field_name;
      const eligible = (codeObj.event_name === rowData.redcap_event_name && codeObj.form_name === rowData.redcap_repeat_instrument)
        ? 1
        : 0;
      const match = (eligible && rowData[fieldName] === codeObj.val)
        ? 1
        : 0;

      if (!unknownMatrix[fieldName]) {
        unknownMatrix[fieldName] = {
          field: fieldName
        };
      }

      const eligKey = `elig_${recordId}`;
      const matchKey = `match_${recordId}`;

      if (!unknownMatrix[fieldName][eligKey]) {
        unknownMatrix[fieldName][eligKey] = 0;
      }

      if (!unknownMatrix[fieldName][matchKey]) {
        unknownMatrix[fieldName][matchKey] = 0;
      }

      unknownMatrix[fieldName][eligKey] += eligible;
      unknownMatrix[fieldName][matchKey] += match;
    });
  }
}


// Funzione per estrarre dai metadati i valori unknown di tutte le variabili che hanno una specifica al riguardo.
// Queste specifiche si trovano nel campo select_choices_or_calculations (per i dropdown) o nel campo field_note (per variabili testuali).
// Non mi interesso delle variabili che hanno note di tipo "if DD unknown...".
export const extractUnknownCodes = (metadata: REDCapMetadataField[], instrumentsVsEvents: REDCapInstrVsEventsField[], repeatings: REDCapRepeatingsField[]) => {
    if (!Array.isArray(metadata)) return [];
    const results: any[] = [];

    metadata.forEach(block => {
      let fieldName = block.field_name;
      let instrumentName = block.form_name;

      const found = instrumentsVsEvents.find(item => item.form === instrumentName);
      if (found === undefined) return [];
      let eventName = found.unique_event_name;

      if (!(isVarRepeating(instrumentName, eventName, repeatings))){
        instrumentName = "";
      }
      
      const note = block.field_note || "";
      const select = block.select_choices_or_calculations || "";

      // Escludo il caso "DD unknown" / "DD Unknown" che può comparire in field_note
      const hasDDUnknown =
      /DD\s+unknown/.test(note);

      if (hasDDUnknown) return [];

      let code = null;

      // Caso 1: field_note → "... If unknown, input ##"
      const noteMatch = note.match(/If unknown,\s*input\s*(\d+)/i);
      if (noteMatch) {
        code = noteMatch[1];
      }

      // Caso 2: select_choices_or_calculations → "...|##, Unknown|..."
      const selectMatch = select.match(/(?:^|\|)\s*(\d+)\s*,\s*Unknown/i);
      if (selectMatch) {
        code = selectMatch[1];
      }

      if (code) {
        results.push({ field_name: fieldName, form_name: instrumentName, event_name: eventName, val: code });
      }
    });

  return results;
}


const isVarRepeating = (instr: string, event: string, repeatingInstrumentsAndEvents: REDCapRepeatingsField[]) => {
    let eventIsRep = repeatingInstrumentsAndEvents.some(item => item.event_name === event);
    if (eventIsRep) {
      // La variabile è repeating se appartiene a event repeating e instrument repeating.
      let instrIsRep = repeatingInstrumentsAndEvents.some(item => item.form_name === instr);
      // Sintassi con "!!" -> ritorna true se instrIsRep è truthy, false se instrIsRep è falsy
      return !!(instrIsRep);
    } 
    else {
      return false;
    }
};
