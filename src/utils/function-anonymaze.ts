import CryptoJS from "crypto-js";


export const removeFieldCheck = (recordData, attribute, pazienteId) => {
	
	console.log('removeFieldCheck');
	
	//per ogni elemento estratto, cerco l attributo da eliminare e lo elimino direttamebnte e aggiungo una numeraizone per i pazienti
	recordData.forEach(item => {

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


export const elapsedDays = (recordData, dateTarget, dateList) => {

	let targetDate = null;
	
	//recupero la data target da usare per le differenze e la converto in Date ( targetDate) poi setto a 0 la colonna
	recordData.forEach(item => {
            if (item[dateTarget]) {
			console.log(item[dateTarget]);
                targetDate = new Date(item[dateTarget]);
				item[dateTarget] = 0;
            }
    });

	recordData.forEach(item => {
		//ciclo su tutte le variabili della lista
        dateList.forEach(date => {
			//controllo che c è un valore
            if (item[date]) {
				console.log(item[date]);
				//estraggo la data e faccio la differenza con la data target in giorni
            	const currentDate = new Date(item[date]);
            	const diffDays = Math.round((currentDate - targetDate) / (1000 * 60 * 60 * 24));
				//lo setto nella cella corrispondente
				item[date] = diffDays;
				console.log(diffDays);
            }
        });
    });

    return recordData;
};


export const hmacHash = (recordData, attributeList, pazienteId, secret) => {
    //const secret = "your-secret-key";

    recordData.forEach(item => {
		//ciclo su tutte le variabili della lista
        attributeList.forEach(attr => {
            if (item[attr]) {
			console.log(item[attr]);
                item[attr] = CryptoJS.HmacSHA256(item[attr], secret).toString();
			console.log(item[attr]);
            }
        });
    });

    return recordData;
};

