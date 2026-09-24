import CryptoJS from "crypto-js";


export const removeFieldCheck = (recordData: any, attribute: any, pazienteId: any) => {
	// Per ogni elemento estratto, cerco l'attributo da eliminare, lo elimino e aggiungo una numerazione per i pazienti
	recordData.forEach((item: any) => {
    delete item[attribute];
		// Metto come prima colonna il counter dei pazienti (colonna "paziente")
		const newItem = {
      paziente: pazienteId,
      ...item
		};
		// Elimino le colonne doppie
		Object.keys(item).forEach(k => delete item[k]);
		Object.assign(item, newItem);
	});

  return recordData;
}


export const elapsedDays = (recordData: any, dateTarget: any, dateList: any) => {
  let targetDate: Date | null = null;

	// Recupero la data target da usare per le differenze e la converto in Date (targetDate) poi setto a 0 la colonna
	recordData.forEach((item: any) => {
    if (item[dateTarget]) {
      targetDate = new Date(item[dateTarget]);
			item[dateTarget] = 0;
    }
  });

	recordData.forEach((item: any) => {
		// Ciclo su tutte le variabili della lista
      dateList.forEach((date: any) => {
			// Controllo ci sia un valore
      if (item[date]) {
        // Estraggo la data
        const currentDate = new Date(item[date]);
        // Gestione delle date se sono null
        const targetTime = targetDate === null ? 0 : targetDate.getTime();
        const currentTime = currentDate === null ? 0 : currentDate.getTime();
        // Faccio la differenza con la data target in giorni
        let diffDays;
        diffDays = Math.round((currentTime - targetTime) / (1000 * 60 * 60 * 24));
        /*
				// Estraggo la data
        const currentDate = new Date(item[date]);
        // Gestione delle date se sono null
        const targetTime = targetDate === null ? 0 : targetDate.getTime();
        const currentTime = currentDate === null ? 0 : currentDate.getTime();
        // Faccio la differenza con la data target in giorni
        let diffDays;
        diffDays = Math.round((currentTime - targetTime) / (1000 * 60 * 60 * 24));
        */
				// Lo setto nella cella corrispondente
				item[date] = diffDays;
      }
    });
  });

  return recordData;
};


export const hmacHash = (recordData: any, attributeList: any, patientId: any, secret: any) => {
  // const secret = "your-secret-key";

  // N.B.: patientId non viene usata in questa funzione, ma serve per la struttura del codice. NON RIMUOVERE!
  console.log("ID paziente: ", patientId);  // Evito il warning di inutilizzo stampandolo in console.

  recordData.forEach((item: any) => {
  // Ciclo su tutte le variabili della lista
    attributeList.forEach((attr: any) => {
      if (item[attr]) {
        item[attr] = CryptoJS.HmacSHA256(item[attr], secret).toString();
      }
    });
  });

  return recordData;
};
