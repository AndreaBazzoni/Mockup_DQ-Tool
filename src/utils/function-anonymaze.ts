import CryptoJS from "crypto-js";


export const removeFieldCheck = (recordData: any, attribute: any, pazienteId: any) => {
	// For each extracted item, I locate the attribute to be removed, I delete it, and I add a numbering for the patients.
	recordData.forEach((item: any) => {
    delete item[attribute];
    
		// I set the patient counter as the first column (column "patient").
		const newItem = {
      paziente: pazienteId,
      ...item
		};

		// I delete the duplicate columns.
		Object.keys(item).forEach(k => delete item[k]);
		Object.assign(item, newItem);
	});

  return recordData;
}


export const elapsedDays = (recordData: any, dateTarget: any, dateList: any) => {
  let targetDate: Date | null = null;

	// I retrieve the target date to be used for calculating differences, convert it into a Date object (targetDate), and then set the column to 0.
	recordData.forEach((item: any) => {
    if (item[dateTarget]) {
      targetDate = new Date(item[dateTarget]);
			item[dateTarget] = 0;
    }
  });

	recordData.forEach((item: any) => {
		// Loop through all variables in the list.
      dateList.forEach((date: any) => {
			// Check for a value.
      if (item[date]) {
        let diffDays;

        // -- How manage null date -> return NA --
        // I extract the date
        const currentDate = new Date(item[date]);
        // Dates management if null.
        if (targetDate === null || currentDate === null) {
          diffDays = "NA";
        }
        else {
          const targetTime = targetDate.getTime();
          const currentTime = currentDate.getTime();
          // Difference in days relative to the target date.
          diffDays = Math.round((currentTime - targetTime) / (1000 * 60 * 60 * 24));
        }

        /*
        // -- How manage null date -> date = 0 --
				// I extract the date
        const currentDate = new Date(item[date]);
        // Dates management if null.
        const targetTime = targetDate === null ? 0 : targetDate.getTime();
        const currentTime = currentDate === null ? 0 : currentDate.getTime();
        // Difference in days relative to the target date.
        let diffDays;
        diffDays = Math.round((currentTime - targetTime) / (1000 * 60 * 60 * 24));
        */

				// I set it in the corresponding cell.
				item[date] = diffDays;
      }
    });
  });

  return recordData;
};


export const hmacHash = (recordData: any, attributeList: any, patientId: any, secret: any) => {

  // NOTE: "patientId" is not used in this function, but it is required for the code structure. DO NOT REMOVE!
  if (patientId === -1) {
    console.log("ID paziente: ", patientId);  // To avoid an "unused variable" error.
  }

  recordData.forEach((item: any) => {
  // Loop through all variables in the list.
    attributeList.forEach((attr: any) => {
      if (item[attr]) {
        item[attr] = CryptoJS.HmacSHA256(item[attr], secret).toString();
      }
    });
  });

  return recordData;
};
