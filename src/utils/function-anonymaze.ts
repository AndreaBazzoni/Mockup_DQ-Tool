import CryptoJS from "crypto-js";


export const removeFieldCheck = (recordData: any, attribute: any, pazienteId: any) => {
	//per ogni elemento estratto, cerco l attributo da eliminare e lo elimino direttamebnte e aggiungo una numeraizone per i pazienti
	recordData.forEach((item: any) => {
    delete item[attribute];
		//metto come prima colonna il counter dei pazienti (colonna 'paziente')
		const newItem = {
      paziente: pazienteId,
      ...item
		};
		//elimino le colonne doppie
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
		//ciclo su tutte le variabili della lista
      dateList.forEach((date: any) => {
			//controllo che c è un valore
      if (item[date]) {
				//estraggo la data e faccio la differenza con la data target in giorni
        const currentDate = new Date(item[date]);
        let diffDays;
        // Controllo che le date non siano "null" (errore con getTime())
        if (currentDate === null || targetDate === null) {
          diffDays = "NA"
        } else {
          diffDays = Math.round((currentDate.getTime() - targetDate.getTime()) / (1000 * 60 * 60 * 24));
        }
				//lo setto nella cella corrispondente
				item[date] = diffDays;
      }
    });
  });

  return recordData;
};


export const hmacHash = (recordData: any, attributeList: any, pazienteId: any, secret: any) => {
  //const secret = "your-secret-key";

  recordData.forEach((item: any) => {
  //ciclo su tutte le variabili della lista
    attributeList.forEach((attr: any) => {
      if (item[attr]) {
        item[attr] = CryptoJS.HmacSHA256(item[attr], secret).toString();
      }
    });
  });

  return recordData;
};
