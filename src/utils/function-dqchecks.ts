export const getAttributeValue = (recordData: any, target_attr: any) => {
	let result = null;

	let lu_instr = {
		bl:{event:"baseline_arm_1",instrument:""}
//		,ufu:{event:"unifocal_arm_1",instrument:"unifocal_followup"}
//		,ulr:{event:"unifocal_arm_1",instrument:"unifocal_local_recurrence"}
		,udm:{event:"unifocal_arm_1",instrument:""}
//		,lfu:{event:"locoregional_arm_1",instrument:"locoregional_followup"}
//		,lpr:{event:"locoregional_arm_1",instrument:"locoregional_progression"}
//		,sfu:{event:"systemic_metastase_arm_1",instrument:"systemic_metastases_followup"}
//		,spr:{event:"systemic_metastase_arm_1",instrument:"systemic_metastases_progression"}
		,lsu:{event:"life_status__clini_arm_1",instrument:""}
	};

	const iter = recordData.length;

  const targetKey = target_attr.split('_')[0] as keyof typeof lu_instr;

	let target_instr = lu_instr[targetKey]["instrument"];
	let target_event = lu_instr[targetKey]["event"];

	for (let i = 0; i < iter; i++) {
		let data = recordData[i];
		let instr = data['redcap_repeat_instrument'];
		let event = data['redcap_event_name'];

		if((event == target_event) && (instr == target_instr)) {
			result = data[target_attr];
			return result;			
		}
	}
	return result;
}


//Function to get the value assigned to a variable in all the instances of the repeating instrument it belongs to
const getAttributeValueRepInstr = (recordData: any, target_attr: any) => {
	// List of names of repeating instruments
	let lu_instr = {
		ufu:{event:"unifocal_arm_1",instrument:"unifocal_followup"}
		,ulr:{event:"unifocal_arm_1",instrument:"unifocal_local_recurrence"}
//		,udm:{event:"unifocal_arm_1",instrument:"unifocal_distant_metastases"}
		,lfu:{event:"locoregional_arm_1",instrument:"locoregional_followup"}
		,lpr:{event:"locoregional_arm_1",instrument:"locoregional_progression"}
		,sfu:{event:"systemic_metastase_arm_1",instrument:"systemic_metastases_followup"}
		,spr:{event:"systemic_metastase_arm_1",instrument:"systemic_metastases_progression"}
//		,lsu:{event:"life_status__clini_arm_1",instrument:"life_status_update"}
	};
		
	const iter = recordData.length;

	let results: Record<string, any> = {};

  const targetKey = target_attr.split('_')[0] as keyof typeof lu_instr;

	let target_instr = lu_instr[targetKey]["instrument"];
	let target_event = lu_instr[targetKey]["event"];

	let count = 0;
	for (let i = 0; i < iter; i++) {
		let data = recordData[i];
		let instr = data['redcap_repeat_instrument'];
		let instance = data['redcap_repeat_instance'];
		let event = data['redcap_event_name'];
		//if the value is found (match of instrument, event and instance) 
		if((event == target_event) && (instr == target_instr) && (instance !== '')) {
			count = count + 1;
			results[instance] = data[target_attr];
		}
	}

	// If the instrument does not exist, result = ""
	if (count == 0) {
		results[count] = "";
	}

	return results;
};


// Function to add days to a Date object
const addDays = (date: any, days: any) => {
	const result = new Date(date);
	result.setDate(result.getDate() + days);
	return result;
};


// Function to check if a single variable (existing in varPath) has the required targetValue
export const varHasValue = (recordData: any, varPath: any, targetValue: any, operator = '==') => {
	const currentValue = getAttributeValue(recordData, varPath);
	if (currentValue == null) {
		return false;
	};

	const operators = {
    ">":  (a: any, b: any) => a > b,
    ">=": (a: any, b: any) => a >= b,
    "<":  (a: any, b: any) => a < b,
    "<=": (a: any, b: any) => a <= b,
    "==": (a: any, b: any) => a === b,
    "!=": (a: any, b: any) => a !== b,
	};

	const compare = operators[operator as keyof typeof operators];

	if (!compare) {
	  throw new Error(`Unsupported operator: ${operator}`);
	}

	return compare(Number(currentValue), targetValue);
};


// Function to check if a single variable (existing in varPath) has the required targetValue
export const varHasValueOLD = (recordData: any, varPath: any, targetValue: any, operator = '==') => {
	let currentValue = getAttributeValue(recordData, varPath);
	if (currentValue == null) return false;

	let results = {};
	results = (currentValue == targetValue);

  // N.B.: "operator" non viene usata in questa funzione, ma serve per la struttura del codice. NON RIMUOVERE!
  if (recordData === null) {
    console.log("Operatore: ", operator);  // Evito il warning di inutilizzo stampando in console.
  }

	return (results);
};


/*
// Function to check if a single variable (existing in varPath) has the required targetValue
export const varHasValueSwitch = (recordData, varPath, targetValue, operator) => {
	//console.log('varHasValue');
	let currentValue = getAttributeValue(recordData, varPath);
	if (currentValue == null) return false;
	let results = {};

	// Perform the comparison based on the provided operator
	switch (operator) {
		case '>':
			results = (currentValue > targetValue);
			break;
		case '>=':
			results = (currentValue >= targetValue);
			break;
		case '<':
			results = (currentValue < targetValue);
			break;
		case '<=':
			results = (currentValue <= targetValue);
			break;
		case '==':
			results = (currentValue === targetValue);
			break;
		case '!=':
			results = (currentValue !== targetValue);
			break;
		default:
			throw new Error(`Unsupported operator: ${operator}`);
	}
	//console.log(results);
	return (results);
};
*/


// Function to check if a single variable (existing in varPath) has the required targetValue
export const varHasValueNeg = (recordData: any, varPath: any, targetValue: any) => {
	let currentValue = getAttributeValue(recordData, varPath);
	if (currentValue == null) return false;

	let results = {};
	results = (currentValue != targetValue);

	return (results);
};


// Function to check if # checks of VarHasValue are ALL true on NON repeating instrument
export const multiVarHasValueAND = (recordData: any, ...throuples: any[]) => {
	// "throuples" is an array containing a list of throuples: [[varPath1,targetValue1], [varPath2,targetValue2], ...]
	// "results" is an array containing the result of each check: [true, false, ...]
	const operators = {
		">":  (a: any, b: any) => a > b,
		">=": (a: any, b: any) => a >= b,
		"<":  (a: any, b: any) => a < b,
		"<=": (a: any, b: any) => a <= b,
		"==": (a: any, b: any) => a == b,
		"!=": (a: any, b: any) => a != b,
	};

	// Array per tenere i risultati di ogni verifica
	const fullResults: any = [];
	const results: any = [];

	throuples.forEach(([varPath, targetValue, operator = '==']) => {
		const currentValue = getAttributeValue(recordData, varPath);

		let result = false;

		if (currentValue != null) {
			const compare = operators[operator as keyof typeof operators];
			if (!compare) {
				throw new Error(`Unsupported operator: ${operator}`);
			}
			result = compare(currentValue, targetValue);
		}

		// results e fullResults sono log miei per il dettaglio, ritorno solo il booleano finale
		results.push(result);
		
		fullResults.push({
			varPath,
			operator,
			targetValue,
			currentValue,
			result
		});
	});

	// Booleano finale: true se tutte le throuple sono vere
	const finalResult = results.every(Boolean);

	return finalResult;
};


// Function to check if # checks of VarHasValue are ALL true on NON repeating instrument
export const multiVarHasValue_OLD = (recordData: any, ...couples: any[]) => {
	// "couples" is an array containing a list of couples: [[varPath1,targetValue1], [varPath2,targetValue2], ...]
	// "results" is an array containing the result of each check: [true, false, ...]
	let results = [];

	for (const couple of couples) {
		let currentValue = getAttributeValue(recordData, couple[0]);
		if (currentValue == null || currentValue != couple[1]) {
			results.push(false);
		}
		else if (currentValue == couple[1]) {
			results.push(true);
		}
	}

	return results.every(value => value === true);
};


// Function to check if # checks of VarHasValue are ALL true on NON repeating instrument
export const multiVarHasValueOR = (recordData: any, ...throuples: any[]) => {
	// "throuples" is an array containing a list of throuples: [[varPath1,targetValue1], [varPath2,targetValue2], ...]
	// "results" is an array containing the result of each check: [true, false, ...]
	const operators = {
		">":  (a: any, b: any) => a > b,
		">=": (a: any, b: any) => a >= b,
		"<":  (a: any, b: any) => a < b,
		"<=": (a: any, b: any) => a <= b,
		"==": (a: any, b: any) => a == b,
		"!=": (a: any, b: any) => a != b,
	};

	// Array per tenere i risultati di ogni verifica
	const fullResults: any = [];
	const results: any = [];

	throuples.forEach(([varPath, targetValue, operator = '==']) => {
		const currentValue = getAttributeValue(recordData, varPath);

		let result = false;

		if (currentValue != null) {
			const compare = operators[operator as keyof typeof operators];
			if (!compare) {
				throw new Error(`Unsupported operator: ${operator}`);
			}
			result = compare(currentValue, targetValue);
		}

		// results e fullResults sono log miei per il dettaglio, ritorno solo il booleano finale
		results.push(result);
		
		fullResults.push({
			varPath,
			operator,
			targetValue,
			currentValue,
			result
		});
	});

	// Booleano finale: true se almeno una throuple è vera
	const finalResult = results.some(Boolean);

	return finalResult;
};


// Function to check if ANY of the # checks of VarHasValue are true on NON repeating instrument
export const multiVarHasValueOR_OLD = (recordData: any, ...couples: any[]) => {
	// "couples" is an array containing a list of couples: [[varPath1,targetValue1], [varPath2,targetValue2], ...]
	// "results" is a single value that becomes true if ANY of the checks is true
	let results = false;

	for (const couple of couples) {
		let currentValue = getAttributeValue(recordData, couple[0]);
		if (currentValue == couple[1]) {
			results = true;
		}
	}

	return results;
};


// Function to check if a single variable (existing in varPath) has the required targetValue
export const varHasValueRepInstr = (recordData: any, varPath: any, targetValue: any, operator = '==') => {
	const operators = {
    ">":  (a: any, b: any) => a > b,
		">=": (a: any, b: any) => a >= b,
		"<":  (a: any, b: any) => a < b,
		"<=": (a: any, b: any) => a <= b,
		"==": (a: any, b: any) => a === b,
		"!=": (a: any, b: any) => a != b,
	};

	// "compare" è un booleano risultato dell'operazione specificata
	const compare = operators[operator as keyof typeof operators];
	if (!compare) {
		throw new Error(`Unsupported operator: ${operator}`);
	}
	// Conteggio delle istanze
	const attrValues = getAttributeValueRepInstr(recordData, varPath);
	const iter = Object.keys(attrValues || {}).length;

	const results = [];

	for (let i = 1; i <= iter; i++) {
		const currentValue = attrValues[i];

		let result = false;

		if (currentValue && currentValue != null &&	currentValue[i] !== "") {
			result = compare(currentValue, targetValue);
		}
		results.push(result);
	}
	return results;
};


// Function to check if # checks of VarHasValue are ALL true within the same instance of the Repeating instrument.
// The check is performed for all the instances of the r.i.
export const varHasValueRepInstr_OLD = (recordData: any, couple: any[]) => {
	// "couples" is an array containing a list of couples: [[varPath1,targetValue1], [varPath2,targetValue2], ...]
	// "results" is an array containing the result of each check: [true, false, ...]
	let results: any = {};

	let instCount = getAttributeValueRepInstr(recordData, couple[0]);
	const iter = Object.keys(instCount).length;

	for (let i = 1; i <= iter; i++) {
		results[i] = Boolean(true);

		let currentValue = getAttributeValueRepInstr(recordData, couple[0]);

		if (currentValue[i] == '' || currentValue[i] == null || currentValue[i] != couple[1]) {
			results[i] = Boolean(false);
			break;
		}

	}

	return results;
};


// Function to check if a value is within an interval on NON repeating instrument
export const varWithinInterval = (recordData: any, attribute: any, min: any, max: any) => {
	let currentValue = getAttributeValue(recordData, attribute);

	return currentValue >= min && currentValue <= max;
};


// Function to compare a date variable to a fixed date string (not a different variable) on NON repeating instrument. 
// A delta (# of days) can be set to an int >= 0 or left to Null
export const dateCompareWithDateString = (recordData: any, targetDatePath: any, refDateStr: any, deltaDays: any, operator: any) => {
	// Retrieve date strings from the record data
	let targetDateStr = getAttributeValue(recordData, targetDatePath);
	
	// Checks
	if (targetDateStr == null || refDateStr == null) {
    //throw new Error("One or more dates are null");
		return false;
	}

	if (deltaDays == null) deltaDays = 0;

  if (isNaN(Number(deltaDays))) {
    throw new Error("Delta is not a number");
  }

	// Convert date strings to Date objects
	let targetDate = new Date(targetDateStr);
	let refDate = new Date(refDateStr);

	// Apply delta to the reference date
	refDate = addDays(refDate, deltaDays);

	// Perform the comparison based on the provided operator
	switch (operator) {
		case ">":
			return targetDate > refDate;
		case ">=":
			return targetDate >= refDate;
		case "<":
			return targetDate < refDate;
		case "<=":
			return targetDate <= refDate;
		case "==":
			return targetDate === refDate;
		case "!=":
			return targetDate !== refDate;
		default:
			throw new Error(`Unsupported operator: ${operator}`);
	}
};


// Function to compare two date variables on NON repeating instrument. 
// A delta (# of days) can be set to an int >= 0 or left to Null
export const dateCompareWithDelta = (recordData: any, targetDatePath: any, refDatePath: any, deltaDays: any, operator: any) => {
	// Retrieve date strings from the record data
	
	let targetDateStr = getAttributeValue(recordData, targetDatePath);
	let refDateStr = getAttributeValue(recordData, refDatePath);

	// Checks
	if ((!targetDateStr) || (!refDateStr)) {
    //throw new Error("One or more dates are null");
		return false;
	}

	if (deltaDays == null) deltaDays = 0;

	if (isNaN(Number(deltaDays))) {
		throw new Error("Delta is not a number");
	}

	// Convert date strings to Date objects
	let targetDate = new Date(targetDateStr);
	let refDate = new Date(refDateStr);

	// Apply delta to the reference date
	refDate = addDays(refDate, deltaDays);

	// Perform the comparison based on the provided operator
	switch (operator) {
		case ">":
			return targetDate > refDate;
		case ">=":
			return targetDate >= refDate;
		case "<":
			return targetDate < refDate;
		case "<=":
			return targetDate <= refDate;
		case "==":
			return targetDate === refDate;
		case "!=":
			return targetDate !== refDate;
		default:
			throw new Error(`Unsupported operator: ${operator}`);
	}
};


// Function to check if a date is within an interval (not necessarily symmetric) on NON repeating instrument. 
// Two deltas (# of days, one for the left interval, one for the right one) can be set to int >= 0 or left to Null
export const dateWithinIntervalWithDeltas = (recordData: any, targetDatePath: any, leftDatePath: any, deltaDaysLeft: any, rightDatePath: any, deltaDaysRight: any) => {
	// Retrieve date strings from the record data
	let targetDateStr = getAttributeValue(recordData, targetDatePath);
	let leftDateStr = getAttributeValue(recordData, leftDatePath);
	let rightDateStr = getAttributeValue(recordData, rightDatePath);

	// Checks
	if (targetDateStr == null || leftDateStr == null || rightDateStr == null) {
    //throw new Error(`One or more dates are null`);
		return false;
	}

	if (deltaDaysLeft == null) deltaDaysLeft = 0;

	if (deltaDaysRight == null) deltaDaysRight = 0;

	if (isNaN(Number(deltaDaysLeft))) {
		throw new Error(`Delta left is not a number`);
	}

	if (isNaN(Number(deltaDaysRight))) {
		throw new Error(`Delta right is not a number`);
	}

	// Convert date strings to Date objects
	let targetDate = new Date(targetDateStr);
	let leftDate = new Date(leftDateStr);
	let rightDate = new Date(rightDateStr);

	leftDate = addDays(leftDate, deltaDaysLeft);
	rightDate = addDays(rightDate, deltaDaysRight);
	
	return ( (leftDate<=targetDate) && (targetDate<=rightDate) );
}


// Function to check if a variable from a repeating instrument has a specific value in two subsequent instances
export const varHasValueWithPreviousSelfRepInstr = (recordData: any, varPath: any, targetValue: any) => {
	let currentValue = getAttributeValueRepInstr(recordData, varPath);

	const iter = Object.keys(currentValue).length;
	
	let results: any = {};
	results[1] = Boolean(true);
	
	if(iter > 1) {
		for (let i = 2; i <= iter; i++) {
			if((currentValue[i] == targetValue) && (currentValue[i-1] == targetValue)) {
				results[i] = Boolean(true);
			}
			else results[i] = Boolean(false);
		}
	}

	return results;
};


// Function to check if two variables (usually carrying the same info) belonging to different Rep Instr have the required values.
// The check is performed between the last instance of the earlier instrument and the first instance of the later instrument.
// "later" and "earlier" are arrays with varname and expected value.
export const multiVarHasValueFirstVsLastInstRepInstr = (recordData: any, later: any[], earlier: any[]) => {
	let instCountL = getAttributeValueRepInstr(recordData, later[0]);
	let instCountE = getAttributeValueRepInstr(recordData, earlier[0]);

	// get the last value of the variable in the earlier Rep instr
	const iterE = Object.keys(instCountE).length;

	let earlierValue = instCountE[iterE];
	let laterValue = instCountL[1];

	return(!(earlierValue == '' || earlierValue == null || earlierValue != earlier[1] || laterValue == "" || laterValue == null || laterValue != later[1]));
	/*
	for (let i = 1; i <= iterE; i++) {
		results[i] = Boolean(true);
		for (const couple of couples) {
			let currentValue = getAttributeValueRepInstr(recordData, couple[0]);

			if (currentValue[i] == '' || currentValue[i] == null || currentValue[i] != couple[1]) {
				results[i] = Boolean(false);
				break;
			}
		}
	}
	*/
}


// Function to check if two variables (usually carrying the same info) belonging to different Rep Instr have the required values.
// The check is performed between the last instance of the earlier instrument and the first instance of the later instrument.
// "later" and "earlier" are arrays with varname and expected value.
export const multiVarHasValueFixedVsLastInstRepInstr = (recordData: any, later: any[], earlier: any[]) => {
	let instCountL = getAttributeValue(recordData, later[0]);
	let instCountE = getAttributeValueRepInstr(recordData, earlier[0]);

	// get the last value of the variable in the earlier Rep instr
	const iterE = Object.keys(instCountE).length;

	let earlierValue = instCountE[iterE];
	let laterValue = instCountL;

	return(!(earlierValue == '' || earlierValue == null || earlierValue != earlier[1] || laterValue == '' || laterValue == null || laterValue != later[1]));
	/*
	for (let i = 1; i <= iterE; i++) {
		results[i] = Boolean(true);
		for (const couple of couples) {
			let currentValue = getAttributeValueRepInstr(recordData, couple[0]);

			if (currentValue[i] == '' || currentValue[i] == null || currentValue[i] != couple[1]) {
				results[i] = Boolean(false);
				break;
			}
		}
	}
	*/
}


// Function to compare a date from a non repeating instrument and one from a repeating instrument over all instances of the latter.
export const multiDateCompareFixedVsLastInstRepInstr = (recordData: any, later: any[], earlier: any[]) => {
	let instCountL = getAttributeValue(recordData, later);
	let instCountE = getAttributeValueRepInstr(recordData, earlier);

	// get the last value of the variable in the earlier Rep instr
	const iterE = Object.keys(instCountE).length;

	let earlierValue = instCountE[iterE];
	let laterValue = instCountL;

	// Convert date strings to Date objects
	let earlierDate = new Date(earlierValue);
	let laterDate = new Date(laterValue);

	return(laterDate > earlierDate);
}


export const multiDateCompareFirstVsLastInstRepInstr = (recordData: any, later: any[], earlier: any[]) => {
	let instCountL = getAttributeValueRepInstr(recordData, later);
	let instCountE = getAttributeValueRepInstr(recordData, earlier);

	// get the last value of the variable in the earlier Rep instr
	const iterE = Object.keys(instCountE).length;

	let earlierValue = instCountE[iterE];
	let laterValue = instCountL[1];

	// Convert date strings to Date objects
	let earlierDate = new Date(earlierValue);
	let laterDate = new Date(laterValue);

	return(laterDate > earlierDate);
}


// Function to check if # checks of VarHasValue are ALL true within the same instance of the Repeating instrument.
// The check is performed for all the instances of the r.i.
export const multiVarHasValueRepInstr = (recordData: any, couples: any[]) => {
	// "couples" is an array containing a list of couples: [[varPath1,targetValue1], [varPath2,targetValue2], ...]
	// "results" is an array containing the result of each check: [true, false, ...]
	let results: any = {};

	let instCount = getAttributeValueRepInstr(recordData, couples[0][0]);
	const iter = Object.keys(instCount).length;

	for (let i = 1; i <= iter; i++) {
		results[i] = Boolean(true);
		for (const couple of couples) {
			let currentValue = getAttributeValueRepInstr(recordData, couple[0]);

			if (currentValue[i] == '' || currentValue[i] == null || currentValue[i] != couple[1]) {
				results[i] = Boolean(false);
				break;
			}
		}
	}

	return results;  
};


// Function to check if a value is within an interval in all the instances of the repeating instrument it belongs to
export const varWithinIntervalRepInstr = (recordData: any, attribute: any, min: any, max: any) => {
	let currentValue = getAttributeValueRepInstr(recordData, attribute);
	
	const iter = Object.keys(currentValue).length;
	
	let results: any = {};
	
	for (let i = 1; i <= iter; i++) {
		if((currentValue[i] >= min) && (currentValue[i] <= max)) {
			results[i] = Boolean(true);
		}
		else results[i] = Boolean(false);
	}

	return results;
};


// Function to compare two variables belonging to the same repeating instrument, within the same instance
export const dateCompareWithDeltaRepInstr = (recordData: any, targetDatePath: any, refDatePath: any, deltaDays: any, operator: any) => {
	// Retrieve date strings from the record data
	let targetDateStr = getAttributeValueRepInstr(recordData, targetDatePath);
	let refDateStr = getAttributeValueRepInstr(recordData, refDatePath);
	
	const iter = Object.keys(targetDateStr).length;
	
	let results: any = {};
	
	for (let i = 1; i <= iter; i++) {

		if (!targetDateStr[i]) {
			results[i] = 1;
//			throw new Error(`The target date is null in instance ${i}`);
		}
		if (!refDateStr[i]) {
			results[i] = 1;
//			throw new Error(`The reference date is null in instance ${i}`);
		}

		if (deltaDays == null) deltaDays = 0;

		if (isNaN(Number(deltaDays))) {
			throw new Error(`Delta is not a number`);
		}

		// Convert date strings to Date objects
		let targetDate = new Date(targetDateStr[i]);
		let refDate = new Date(refDateStr[i]);

		switch (operator) {
			case ">":
				results[i] = (targetDate > addDays(refDate, deltaDays));
				break;
			case ">=":
				results[i] = (targetDate >= addDays(refDate, deltaDays));
				break;
			case "<":
				results[i] = (targetDate < addDays(refDate, deltaDays));
				break;
			case "<=":
				results[i] = (targetDate <= addDays(refDate, deltaDays));
				break;
			case "==":
				results[i] = (targetDate === addDays(refDate, deltaDays));
				break;
			case "!=":
				results[i] = (targetDate !== addDays(refDate, deltaDays));
				break;
			default:
				throw new Error(`Unsupported operator: ${operator}`);
		}
	}

	return results;
};


// Function to compare a date variable to itself in the current and previous instance of the repeating instrument it belongs to
export const dateCompareWithPreviousSelfRepInstr = (recordData: any, targetDatePath: any, deltaDays: any, operator: any) => {
	// Retrieve date strings from the record data
	let targetDateStr = getAttributeValueRepInstr(recordData, targetDatePath);
	
	const iter = Object.keys(targetDateStr).length;
	
	let results: any = {};
	results[1] = Boolean(true);
	
	if(iter > 1) {
		for (let i = 2; i <= iter; i++) {
			if (!targetDateStr[i]) { 
				//console.log(`The date is null in instance ${i}`);
			  //throw new Error(`The date is null in instance ${i}`);
			}
			if (!targetDateStr[i-1]) {
				//console.log(`The date is null in instance ${i-1}`);
				//throw new Error(`The date is null in instance ${i-1}`);
			}

			if (deltaDays == null) {
				deltaDays = 0;
			}

			if (isNaN(Number(deltaDays))) {
				throw new Error(`Delta is not a number`);
			}

			// Convert date strings to Date objects
			let targetDate = new Date(targetDateStr[i]);
			let targetDatePrev = new Date(targetDateStr[i-1]);

			switch (operator) {
				case ">":
					results[i] = (targetDate > addDays(targetDatePrev, deltaDays));
					break;
				case ">=":
					results[i] = (targetDate >= addDays(targetDatePrev, deltaDays));
					break;
				case "<":
					results[i] = (targetDate < addDays(targetDatePrev, deltaDays));
					break;
				case "<=":
					results[i] = (targetDate <= addDays(targetDatePrev, deltaDays));
					break;
				case "==":
					results[i] = (targetDate === addDays(targetDatePrev, deltaDays));
					break;
				case "!=":
					results[i] = (targetDate !== addDays(targetDatePrev, deltaDays));
					break;
				default:
					throw new Error(`Unsupported operator: ${operator}`);
			}
		}
	}

	return results;
};

// Function to compare a date from a repeating instrument to a fixed date from a non repeating one (e.g. date of followup)
export const dateCompareToFixedDateRepInstr = (recordData: any, targetDatePath: any, refDatePath: any, deltaDays: any, operator: any, acceptNull: any) => {
	// Retrieve date strings from the record data
	let targetDateStr = getAttributeValueRepInstr(recordData, targetDatePath);
	let refDateStr = getAttributeValue(recordData, refDatePath);
	
	let results: any = {};

	if (!refDateStr) {
		return false;
		//throw new Error(`The reference date is null`);
		//results[1] = 1;
	}
	else {
		// La data di nascita è solo anno. Attacco mese e giorno 01-01
		if (refDatePath == '0.bl_dob') {
			refDateStr = refDateStr + '-01-01';
		}
		const iter = Object.keys(targetDateStr).length;
		for (let i = 1; i <= iter; i++) {
			if (deltaDays == null) deltaDays = 0;
			if (isNaN(Number(deltaDays))) {
				throw new Error(`Delta is not a number`);
			}
			// Se non è accettabile che il valore della data da comparare sia nullo, triggero un errore
			if (acceptNull == 0) {
				if (!targetDateStr[i]) {
			    //throw new Error(`The date is null in instance ${i}`);
					results[i] = false;
				}
			}
			if  (acceptNull == 1) {
				if (!targetDateStr[i]) {
					results[i] = true;
					continue;
				}
			}
			
			// Convert date strings to Date objects
			let targetDate = new Date(targetDateStr[i]);
			let refDate = new Date(refDateStr);

			switch (operator) {
				case ">":
					results[i] = (targetDate > addDays(refDate, deltaDays));
					break;
				case ">=":
					results[i] = (targetDate >= addDays(refDate, deltaDays));
					break;
				case "<":
					results[i] = (targetDate < addDays(refDate, deltaDays));
					break;
				case "<=":
					results[i] = (targetDate <= addDays(refDate, deltaDays));
					break;
				case "==":
					results[i] = (targetDate === addDays(refDate, deltaDays));
					break;
				case "!=":
					results[i] = (targetDate !== addDays(refDate, deltaDays));
					break;
				default:
					throw new Error(`Unsupported operator: ${operator}`);
			}
		}
	}

	return results;
};


// The following is used in case there is a comparison between a date that must be unique but is featured in repeating instruments,
// so it might appear in more than one instance, and a date coming from a non-repeating instrument (e.g., date of menopause > date of birth). 
// If the unique value appears in multiple instances, these are expected to be identical, otherwise triggering error
export const uniqueDateCompareToFixedDateRepInstr = (recordData: any, targetDatePath: any, refDatePath: any, deltaDays: any, operator: any, acceptNull: any) => {
	// Retrieve date strings from the record data
	let targetDateObj = getAttributeValueRepInstr(recordData, targetDatePath);

	// Array of distinct non null/blank values of the unique date. Supposed max length = 1
	const values = Object.values(targetDateObj);
	const filteredDates = values.filter(date => date); // this will filter out any falsy values (including empty strings)
	const targetDateArr = Array.from(new Set(filteredDates));

	if (targetDateArr.length > 1) {
    //throw new Error(`There are multiple values for the date in the repeating instrument (expected one)`);
		return false;
	}

	let refDateStr = getAttributeValue(recordData, refDatePath);
	
	let results = false;

	if (!refDateStr) {
    //throw new Error(`The reference date is null`);
		return false;
	}

	// Se il confronto è con la la data di nascita, quella è solo anno. Attacco mese e giorno 01-01
	if (refDatePath == '0.bl_dob') {
		refDateStr = refDateStr + '-01-01';
	}
			
	if (deltaDays == null) deltaDays = 0;
	if (isNaN(Number(deltaDays))) throw new Error(`Delta is not a number`);

	// Se non è accettabile che il valore della data da comparare sia nullo, triggero un errore
	if (acceptNull == 0) {
		if (!targetDateArr) {
			return false;
		  //throw new Error(`The date is null in instance ${i}`);
		}
	}
	// Se la data da comparare può essere nulla (e.g. data di menopausa)
	else if  (acceptNull == 1) {
		// Se è nulla, il risultato del confronto è assunto vero
		if (targetDateArr.length == 0) {
			results = true;
		}
		// Altrimenti faccio il confronto
		else {
			// Convert date strings to Date objects
			let targetDateStr = targetDateArr[0];
	
			let targetDate = new Date(targetDateStr);
			let refDate = new Date(refDateStr);

			switch (operator) {
				case ">":
					results = (targetDate > addDays(refDate, deltaDays));
					break;
				case ">=":
					results = (targetDate >= addDays(refDate, deltaDays));
					break;
				case "<":
					results = (targetDate < addDays(refDate, deltaDays));
					break;
				case "<=":
					results = (targetDate <= addDays(refDate, deltaDays));
					break;
				case "==":
					results = (targetDate === addDays(refDate, deltaDays));
					break;
				case "!=":
					results = (targetDate !== addDays(refDate, deltaDays));
					break;
				default:
					throw new Error(`Unsupported operator: ${operator}`);
			}
		}
	}
	
	return results;
};


// The following is used in case there is a comparison between a date that must be unique but is featured in repeating instruments
// so it might appear in more than one instance, and a date coming from a non-repeating instrument (e.g., date of menopause > date of birth). 
// If the unique value appears in multiple instances, these are expected to be identical, otherwise triggering error
export const compareAllDatesToFixed = (recordData: any, targetDateArr: any, refDatePath: any, deltaDays: any, operator: any, acceptNull: any) => {
	// Verifiche sulla data con cui comparare le altre
	let refDateStr = getAttributeValue(recordData, refDatePath);
	
	let results: any = {};

	if (!refDateStr) {
    //throw new Error(`The reference date is null`);
		return false;
	}

	// Se il confronto è con la la data di nascita, quella è solo anno. Attacco mese e giorno 01-01
	if (refDatePath == '0.bl_dob') {
		refDateStr = refDateStr + '-01-01';
	}
			
	if (deltaDays == null) deltaDays = 0;
	if (isNaN(Number(deltaDays))) throw new Error(`Delta is not a number`);

	const iterArray = Object.keys(targetDateArr).length;
	
	let dateValues: any = {};
	
	for (let j = 0; j < iterArray; j++) {	
		dateValues[j] = getAttributeValue(recordData, targetDateArr[j]);
	}

	const trueValues: any[] = Object.values(dateValues);

	//const filteredDates = trueValues.filter(date => date);  // this will filter out any falsy values (including empty strings)
	//const targetDateArr = Array.from(new Set(filteredDates));

	for (let j = 0; j < trueValues.length; j++) {
		let targetDateStr = trueValues[j];
		
		if (!targetDateStr) {
			if (acceptNull === 0) {
        //throw new Error('One or more dates to compare are null');
				return false;
			}
			else {
				results[j] = true;
			}
		}
    else {
			let targetDate = new Date(targetDateStr);
			let refDate = new Date(refDateStr);

			switch (operator) {
				case ">":
					results[j] = (targetDate > addDays(refDate, deltaDays));
					break;
				case ">=":
					results[j] = (targetDate >= addDays(refDate, deltaDays));
					break;
				case "<":
					results[j] = (targetDate < addDays(refDate, deltaDays));
					break;
				case "<=":
					results[j] = (targetDate <= addDays(refDate, deltaDays));
					break;
				case "==":
					results[j] = (targetDate === addDays(refDate, deltaDays));
					break;
				case "!=":
					results[j] = (targetDate !== addDays(refDate, deltaDays));
					break;
				default:
					throw new Error(`Unsupported operator: ${operator}`);
			}
		}
	}

	return results;
};


// The following is used in case there is a comparison between a date that must be unique but is featured in repeating instruments
// so it might appear in more than one instance, and the max value of a date coming from a repeating instrument (e.g., date of death > date of last follow up). 
// If the unique value appears in multiple instances, these are expected to be identical, otherwise triggering error
export const uniqueDateCompareToMaxDateRepInstr = (recordData: any, targetDatePath: any, refDatePath: any, deltaDays: any, operator: any, acceptNull: any) => {
	// Retrieve date strings from the record data
	let targetDateObj = getAttributeValueRepInstr(recordData, targetDatePath);

	let refDateObj = getAttributeValueRepInstr(recordData, refDatePath);

	// Array of distinct non null/blank values of the unique date. Supposed max length = 1
	const values = Object.values(targetDateObj);
	const filteredDates = values.filter(date => date); // this will filter out any falsy values (including empty strings)
	const targetDateArr = Array.from(new Set(filteredDates));

	if (targetDateArr.length > 1) {
    //throw new Error("There are multiple values for " + targetDatePath + " in the repeating instrument (expected one)");
		return false;
	}
	
	const refValues = Object.values(refDateObj);
	const filteredRefDates = refValues.filter(date => date);  // this will filter out any falsy values (including empty strings)
	const refDateArr = Array.from(new Set(filteredRefDates));
	
	if (!refDateArr || refDateArr.length === 0) {
    //throw new Error("There is no valid " + refDatePath + " available for the comparison");
		return false;
	}
	let results = false;
		
	if (deltaDays == null) deltaDays = 0;
	if (isNaN(Number(deltaDays))) throw new Error(`Delta is not a number`);

	// Se non è accettabile che il valore della data da comparare sia nullo, triggero un errore
	if (acceptNull == 0) {
		if (!targetDateArr || targetDateArr.length === 0) {
      //throw new Error(targetDatePath + " is always null");
			return false;
		}
	}
  // Se la data da comparare può essere nulla (e.g. data di menopausa)
  else if (acceptNull == 1) {
		// Se E' nulla, il risultato del confronto è assunto vero
		if (targetDateArr.length === 0) {
			results = true;
		}
    // Altrimenti faccio il confronto
    else {
			// Convert date strings to Date objects
			let targetDateStr = targetDateArr[0];
			let targetDate = new Date(targetDateStr);
			let maxRefDate = new Date(Math.max(...refDateArr.map(d => new Date(d).getTime())));

			switch (operator) {
				case ">":
					results = (targetDate > addDays(maxRefDate, deltaDays));
					break;
				case ">=":
					results = (targetDate >= addDays(maxRefDate, deltaDays));
					break;
				case "<":
					results = (targetDate < addDays(maxRefDate, deltaDays));
					break;
				case "<=":
					results = (targetDate <= addDays(maxRefDate, deltaDays));
					break;
				case "==":
					results = (targetDate === addDays(maxRefDate, deltaDays));
					break;
				case "!=":
					results = (targetDate !== addDays(maxRefDate, deltaDays));
					break;
				default:
					throw new Error(`Unsupported operator: ${operator}`);
			}
		}
	}

	return results;
};
