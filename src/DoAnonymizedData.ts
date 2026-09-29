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


export const DoAnonymizedData = async (
  recordDataResults: REDCapRecord[][]
) => {
  // Inizializzo il vettore risultante e il conteggio dei pazienti
  let anonymizedResults: Record<number, REDCapRecord[]> = {};
  let patientCounter = 1;

  // Chiave per l'anonimizzazione
  let secret = "prova_segreto";

  try {
    // Faccio una copia di recordDataResult così non lo sovrascrivo
    const anonymousRecordData = JSON.parse(JSON.stringify(recordDataResults));

    // Process each record
    anonymousRecordData.forEach((recordRows: REDCapRecord[]) => {
      const recordId = recordRows[0].bl_record_id;
      if (!recordId) {
        console.error("Record senza bl_record_id.");
        return;
      }
      // -- Funzione di Anonimizzazione --
      let anon = anonymazeData(recordRows, patientCounter, secret);
      // Salvo le righe del Record
      anonymizedResults[patientCounter] = anon;
      // Incremento il Counter
      patientCounter++;
		});
    return anonymizedResults;

  } catch (err: any) {
    console.error(err.message || "Error during the Data Anonymization.");
    return null;
  }
};
