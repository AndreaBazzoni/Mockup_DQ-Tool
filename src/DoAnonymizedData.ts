import { anonChecks } from "@/utils/config-anonymaze";
import type { REDCapRecord } from "@/utils/types";


// Funzione per anonimizzare i Dati
export const anonymazeData = (
  data: REDCapRecord[],
  pazienteId: number,
  secret: string
): REDCapRecord[] => {
  let results: REDCapRecord[] = [];
  
  // Eseguire dinamicamente ogni controllo in base alla configurazione.
  anonChecks.forEach(check => {
    // Valutazione del controllo.
    results = check.func(data, ...check.params, pazienteId, secret);
  });

  return results;
};


export const DoAnonymizedData = async (
  allRecordDataResults: REDCapRecord[][]
) => {
  // Inizializzo il vettore risultante e il conteggio dei pazienti.
  let anonymizedResults: Record<number, REDCapRecord[]> = {};
  let patientCounter = 1;

  // Chiave per l'anonimizzazione
  let secret = "prova_segreto";

  try {
    // Faccio una copia di allRecordDataResult così non lo sovrascrivo.
    const anonymousAllRecordData = JSON.parse(JSON.stringify(allRecordDataResults));

    // Elabora ciascun record.
    anonymousAllRecordData.forEach((recordRows: REDCapRecord[]) => {
      const recordId = recordRows[0].bl_record_id;
      if (!recordId) {
        console.error("Record senza bl_record_id.");
        return;
      }
      // -- Anonymization Function --
      let anon = anonymazeData(recordRows, patientCounter, secret);
      // Salvo le righe del Record.
      anonymizedResults[patientCounter] = anon;
      // Incremento il Counter.
      patientCounter++;
		});

    return anonymizedResults;
  }

  catch (err: any) {
    console.error(err.message || "Error during the Data Anonymization.");
    return null;
  }
};
