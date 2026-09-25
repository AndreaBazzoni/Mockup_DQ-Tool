import { anonChecks } from "@/utils/config-anonymaze";
import type { REDCapRecord } from "@/utils/types";


// Funzione per anonimizzare i Dati
export const anonymazeData = (
  data: REDCapRecord[],
  pazienteId: number,
  secret: string
): REDCapRecord[] => {
	let results: REDCapRecord[] = [];
	
	// Dynamically execute each check based on the configuration
	anonChecks.forEach(check => {
		// Evaluate the check
		results = check.func(data, ...check.params, pazienteId, secret);
	});

	return results;
};
