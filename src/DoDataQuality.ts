import { getMetadata, getInstrVsEvents, getRepeatings } from "@/fetch/dq-fetch";
import { dqChecks } from "@/utils/config-dqchecks";
import type { REDCapRecord, DQRecord, DQContext, REDCapMetadataField, BranchRefVar, VariableRef } from "@/utils/types";


export const getEventOfInstrument = (instrument: string, dqContext: DQContext) => {
	let instrumentsVsEvents = dqContext.instrumentsVsEvents;

  const found = instrumentsVsEvents.find(item => item.form === instrument);

  if (found === undefined) {
    return null;
  }
  else {
    return found.unique_event_name;
  }
};


export const isVarRepeating = (instr: string, event: string | null, dqContext: DQContext) => {
  let repeatingInstrumentsAndEvents = dqContext.repeatingInstrumentsAndEvents;

  const eventIsRep = repeatingInstrumentsAndEvents.some(item => item.event_name === event);

  if (eventIsRep) {
    // La variabile è repeating se appartiene a event repeating e instrument repeating
    let instrIsRep = repeatingInstrumentsAndEvents.some(item => item.form_name === instr);
    // Sintassi con !! ritorna true se instrIsRep è truthy, false se è falsy
    return !!(instrIsRep);
  } 
  else {
    return false;
  }
};


export const varHasBranchingLogic = (metadataElem: REDCapMetadataField) => {
	if (metadataElem.branching_logic) {
		return true;
	} else {
		return false;
	}
};


export const runBranchingLogic = (metadataOfVar: REDCapMetadataField, isRepeating: boolean, instance: any, dqContext: DQContext) => {
	// Espressione di branching, così come specificata su REDCap
	let branchingOrigExpr = metadataOfVar["branching_logic"];

	// La variabile di riferimento per la branching
	let branchRefVar: BranchRefVar = {
    name: metadataOfVar.field_name,
    instrument: metadataOfVar.form_name,
    event: getEventOfInstrument(metadataOfVar.form_name, dqContext)
  };

	if (!isRepeating) {
		let evaluableBranchLogicExpr = compileBranchingLogicExpressionNonRepeating(branchingOrigExpr, branchRefVar, dqContext);
		let result = null;
		if (evaluableBranchLogicExpr != "") {
			result = evalRedcap(evaluableBranchLogicExpr);
		}
		return result;
	}

  else if (isRepeating) {
		let evaluableBranchLogicExpr = compileBranchingLogicExpressionRepeating(branchingOrigExpr, branchRefVar, instance, dqContext);
		let result = null;
		if (evaluableBranchLogicExpr != "") {
			result = evalRedcap(evaluableBranchLogicExpr);
		}
		return result;
	}

	return true;
};


export const compileBranchingLogicExpressionNonRepeating = (branchingOrigExpr: string, mainVar: BranchRefVar, dqContext: DQContext) => {
	// Estraggo le variabili dentro la branching logic
	// Ciascuna diventa un oggetto con 6 proprietà:
	//   1) event -> evento della var (può essere nullo a questo punto se non è esplicitato nella branching expression)
	//   2) field -> nome della variabile (nei check segue la sua convenzione eg "ufu_symptoms(1)")
	//   3) instance -> instance (può essere nulla). Quando ha valore può essere:
	//			  [current-instance] refers to the current instance
	//			  [previous-instance] refers to the instance immediately previous
	//			  [next-instance] refers to the instance immediately after
	//			  [first-instance] refers back to the very first instance
	//			  [last-instance] refers back to the very last instance
  //      (AL MOMENTO INSTANCE NON E' GESTITO DALLA LOGICA A SEGUIRE)
	//   4) orig -> come dichiarata in branching expression
	//   5) realField -> nome della variabile come in redcap data (diverso da field nel caso dei checkbox)
	//   6) realVar -> nome della variabile come in redcap metadata (diverso da field nel caso dei checkbox)
	let varsInBranching = extractRedcapVariables(branchingOrigExpr, dqContext);

	// Espressione in cui sostituiremo valori e operatori per renderla interpretabile da JS
	let workingBranchExpression = branchingOrigExpr;

	// Per ogni variabile della branching logic
	varsInBranching.forEach(varOfBranching => {
		// Completare info su event mettendo quello di mainVar se non specificato
		let completeVar = varOfBranching;
		if (completeVar.event == null) {
			completeVar.event = mainVar.event;
		}
		// Prendere riga di data che contiene la variabile (non repeating) corrente
		let rightData4Var = getFirstEventFromDataForVar(completeVar, null, dqContext);
		// Se quella riga esiste
		if (rightData4Var) {
			// Sostituisce il nome variabile con il valore preso dalla riga
			workingBranchExpression = replaceVarWithValue(workingBranchExpression, varOfBranching, rightData4Var);
		}
		workingBranchExpression = translateRedcapToJs(workingBranchExpression, { strict: false });
	});

	return workingBranchExpression;
};


export const compileBranchingLogicExpressionRepeating = (branchingOrigExpr: string, mainVar: BranchRefVar, instance: any, dqContext: DQContext) => {
	let metadata = dqContext.metadata;
	// Estraggo le variabili dentro la branching logic
	// Ciascuna diventa un oggetto con 6 proprietà:
	//   1) event -> evento della var (può essere nullo a questo punto se non è esplicitato nella branching expression)
	//   2) field -> nome della variabile (nei check segue la sua convenzione eg "ufu_symptoms(1)")
	//   3) instance -> instance (può essere nulla). Quando ha valore può essere:
	//			  [current-instance] refers to the current instance
	//			  [previous-instance] refers to the instance immediately previous
	//			  [next-instance] refers to the instance immediately after
	//			  [first-instance] refers back to the very first instance
	//			  [last-instance] refers back to the very last instance
  //      (AL MOMENTO INSTANCE NON E' GESTITO DALLA LOGICA A SEGUIRE)
	//   4) orig -> come dichiarata in branching expression
	//   5) realField -> nome della variabile come in redcap data (diverso da field nel caso dei checkbox)
	//   6) realVar -> nome della variabile come in redcap metadata (diverso da field nel caso dei checkbox)
	let varsInBranching = extractRedcapVariables(branchingOrigExpr, dqContext);

  // Espressione in cui sostituiremo valori e operatori per renderla interpretabile da JS
	let workingBranchExpression = branchingOrigExpr;

	// Per ogni variabile della branching logic
	varsInBranching.forEach(branchVar => {
		// Completare info su event mettendo quello di mainVar se non specificato
		let completeBranchVar = branchVar;
		if (completeBranchVar.event == null) {
			completeBranchVar.event = mainVar.event;
		}
		// Devo trovare la giusta istanza della variabile corrente per sostituire il valore nell'espressione
		  // Metadata di branchVar
		let metadataOfBranchVar = metadata.find(item => item.field_name === completeBranchVar.realVar);
		  // Instrument di variabile corrente
    if (metadataOfBranchVar === undefined) {
      return "";
    }
		let instrumentOfBranchVar = metadataOfBranchVar["form_name"];
		  // Capire se la var in questione è repeating
    if (completeBranchVar.event === null) {
      return "";
    }
		let isBranchVarRepeating = isVarRepeating(instrumentOfBranchVar, completeBranchVar.event, dqContext);

		// Estrarre la riga giusta da data
		let rightData4Var;
		if (isBranchVarRepeating) {
			// Se repeating prendo la row di data corrispondente
			let dataRows = getRowsOfDataForRepeatingVar(instrumentOfBranchVar, completeBranchVar.event, dqContext);
      if (dataRows === false) {
        return "";
      }
			let realInstance = (instance == 0) ? "" : instance
			// "realInstance" è instance della mainVar e assume solo valori numerici (o null che è 0)
			let targetInstance = realInstance;
			if (branchVar.instance == "current-instance") {
				targetInstance = realInstance;
			}
      else if (branchVar.instance == "previous-instance") {
				targetInstance = realInstance - 1;
			}
      else if (branchVar.instance == "next-instance") {
				targetInstance = realInstance + 1;
			}
      else if (branchVar.instance == "first-instance") {
				targetInstance = 0;
			}
      else if (branchVar.instance == "previous-instance") {
				targetInstance = realInstance - 1;
			}
			rightData4Var = dataRows.find(row => row.redcap_repeat_instance === targetInstance)
		}
    else {
			rightData4Var = getFirstEventFromDataForVar(completeBranchVar, null, dqContext);
		}

		// Se quella riga esiste
		if (rightData4Var) {
			// Sostituisce il nome variabile con il valore preso dalla riga
			workingBranchExpression = replaceVarWithValue(workingBranchExpression, branchVar, rightData4Var);
		}
		workingBranchExpression = translateRedcapToJs(workingBranchExpression, { strict: false });
	});

	return workingBranchExpression;
};


export const evalRedcap = (jsExpr: string, { fallback = false } = {}) => {
	console.log('[evalRedcap] jsExpr =', jsExpr);

	try {
		// Coerzione e trimming minimi: non trasformo altro
		const s = String(jsExpr ?? '').trim();

		// Se vuoto, ritorno il fallback (evita "return ()" -> SyntaxError)
		if (!s) {
			console.warn('[evalRedcap] Espressione vuota: ritorno fallback');
			return fallback;
		}

		// Valutazione come espressione
		console.log('branching is ' + Function(`"use strict"; return (${s});`)());
		return Function(`"use strict"; return (${s});`)();

	} catch (err) {
		// Log chiaro e callback opzionale
		console.error('[evalRedcap] Errore durante la valutazione:', err);
		console.error('[evalRedcap] Espressione non valutabile:', jsExpr);
		return fallback;
	}
};


export const extractRedcapVariables = (logic: string, dqContext: DQContext) => {
	// matcha sequenze tipo: [xxx][yyy][zzz] (token completo)
	const tokenRegex = /(\[[^\]]+\])+/g;
	// matcha singole [parte]
	const partRegex = /\[([^\]]+)\]/g;

	const results = [];
	const seen = new Set();  // evita duplicati "per variabile" (non per posizione)

	// regex per estrarre "nomeCampo(numero)" alla fine del nome campo
	// ATTENZIONE: indice SOLO numerico. Se servono codici non numerici, bisogna estendere a ([^)]+).
	const fieldWithIndexRegex = /^(.*)\((\d+)\)$/;

	let tokenMatch;
	while ((tokenMatch = tokenRegex.exec(logic)) !== null) {
		const token = tokenMatch[0];  // l'intero token matchato
		// Estrai le parti dal token
		const parts = [];
		let p;
		partRegex.lastIndex = 0;  // reset ad ogni token
		while ((p = partRegex.exec(token)) !== null) {
			parts.push(p[1]);
		}
		const variable: VariableRef = {
			event: null,
			instrument: null,
			field: null,
			instance: null,
			orig: token,
			realField: "",
			realVar: "",
      raw: null
		};

		if (parts.length === 1) {
			// [field]
			variable.field = parts[0];
		}

    else if (parts.length === 2) {
			// [event][field]
			variable.event = parts[0];
			variable.field = parts[1];
			let metadataOfField = dqContext.metadata.find(
				m => m.field_name === variable.field
			);
			variable.instrument = metadataOfField?.form_name ?? null;
		}

    else if (parts.length === 3) {
			// [event][field][instance]
			variable.event = parts[0];
			variable.field = parts[1];
			let metadataOfField = dqContext.metadata.find(
				m => m.field_name === variable.field
			);
			variable.instrument = metadataOfField?.form_name ?? null;

			variable.instance = parts[2];
		}
    
    else {
			// Casi anomali
			variable.raw = parts;
		}

		// Calcolo di realField / realVar
		// - Checkbox: se field finisce con "(numero)" -> realVar = base, realField = base___numero
		// - Non-checkbox: realVar = field, realField = field (uguali)
		if (variable.field) {
			const m = variable.field.match(fieldWithIndexRegex);
			if (m) {
				const base = m[1];
				const idx = m[2];
				variable.realVar = base;
				variable.realField = `${base}___${idx}`;  // convenzione REDCap per checkbox
			} else {
				variable.realVar = variable.field;
				variable.realField = variable.field;
			}
		}

		// De-duplicazione basata su event/field/instance
		const key = JSON.stringify({
			event: variable.event,
			instrument: variable.instrument,
			field: variable.field,
			instance: variable.instance
		});

		if (!seen.has(key)) {
			seen.add(key);
			results.push(variable);
		}
	}

	return results;
};


export const getFirstEventFromDataForVar = (variable: VariableRef, contextInstance: string | null, dqContext: DQContext) => {
	let allData = dqContext.data;

	const isValidInstrument = dqContext.repeatingInstrumentsAndEvents.some(
		item =>
			item.event_name === variable.event &&
			item.form_name === variable.instrument
	);

	if (!isValidInstrument) {
		variable.instrument = null;
	}

	const eventRows = allData.filter(row => (row.redcap_event_name === variable.event) && ((row.redcap_repeat_instrument || null) === variable.instrument));

  const instKeyword = variable.instance;

  // =========================
  // CASO 1: NO INSTANCE LOGIC
  // =========================
  if (!instKeyword || !String(instKeyword).includes('-instance')) {
    // NON repeating instrument (baseline rows)
    const nonRepeating = eventRows.find(
      r =>
        (!r.redcap_repeat_instrument || r.redcap_repeat_instrument === '')
    );
    return nonRepeating;
  }

  // =========================
  // CASO 2: REPEATING CONTEXT
  // =========================
  const rows = eventRows.filter(
    r => r.redcap_repeat_instrument &&
      r.redcap_repeat_instrument !== "" &&
      r.redcap_repeat_instrument === variable.instrument
  );
  if (rows.length === 0) return undefined;

  const sorted = [...rows].sort(
    (a, b) =>
      Number(a.redcap_repeat_instance || 0) -
      Number(b.redcap_repeat_instance || 0)
  );

  const current = Number(contextInstance ?? 0);

  switch (instKeyword) {
    case 'first-instance':
      return sorted[0];
    case 'last-instance':
      return sorted[sorted.length - 1];
    case 'current-instance':
      return sorted.find(r =>
        Number(r.redcap_repeat_instance) === current
      );
    case 'previous-instance':
      return [...sorted]
        .reverse()
        .find(r =>
          Number(r.redcap_repeat_instance) < current
        );
    case 'next-instance':
      return sorted.find(r =>
        Number(r.redcap_repeat_instance) > current
      );
    default:
      return sorted.find(r =>
        Number(r.redcap_repeat_instance) === current
      );
  }
};


export const getRowsOfDataForRepeatingVar = (instr: string, event: string, dqContext: DQContext) => {
	let repeatingInstrumentsAndEvents = dqContext.repeatingInstrumentsAndEvents;
	let allData = dqContext.data;

	let eventIsRep = repeatingInstrumentsAndEvents.some(item => item.event_name === event);
	if (eventIsRep) {
		const eventRows = allData.filter(item => item.redcap_event_name === event && item.redcap_repeat_instrument === instr);
		return eventRows;
	}
  else {
		let instrIsRep = repeatingInstrumentsAndEvents.some(item => item.form_name === instr);
		if (instrIsRep) {
			return allData.filter(item => (item.redcap_event_name === event) && ((item: REDCapRecord) => item.form_name === instr));
		}
    else {
			return false;
		}
	}
};


export const replaceVarWithValue = (expression: string, variable: VariableRef, dataRow: REDCapRecord) => {
	let value4replacing = dataRow[variable.realField];
	let newExpression = expression.replaceAll(variable.orig, "'" + value4replacing + "'");
	return newExpression;
};


export const translateRedcapToJs = (expr: string, { strict = true } = {}) => {
	let s = String(expr);

	// 1) Entità HTML -> simboli JS
	s = s
		.replace(/&lt;=/gi, '<=')
		.replace(/&gt;=/gi, '>=')
		.replace(/&lt;/gi, '<')
		.replace(/&gt;/gi, '>')
		.replace(/&amp;&amp;/gi, '&&')
		.replace(/&amp;\|\|/gi, '||');

	// 2) Parole logiche
	s = s
		.replace(/\bAND\b/gi, '&&')
		.replace(/\bOR\b/gi, '||');

	// 3) Diverso "<>"
	s = s.replace(/<>/g, strict ? '!==' : '!=');

	// 4) Uguaglianza singola "=" -> === / == (evitando "==", ">=", "<=", "!=")
	const eqTarget = strict ? '===' : '==';
	s = s.replace(/(^|[^!<>=])=(?!=)/g, `$1${eqTarget}`);

	// 5) Pulizia cosmetica
	s = s.replace(/\s+/g, ' ').trim();

	return s;
};


const nonexistentVars = (varsArray: string[], dqContext: DQContext) => {
	const vars = new Set();
	const walk = (value: any) => {
		// Eseguo ricorsivamente finché il type dell'espressione esaminata è un array (per la lista delle var non dovrebbe accadere). 
		if (Array.isArray(value)) {
			value.forEach(walk);
		} 
		// Se invece è stringa, valuto se esiste nei metadata (quindi è una variabile).
		else if (
			typeof value === "string"
		) {
			// Verifico se value è una variabile esistente nei metadata REDCap. TUTTE le var dovrebbero esserlo; se non è così è un errore.
			let metadata = dqContext.metadata;
			let metadataOfValue = metadata.find(item => item.field_name === value);
			if (typeof metadataOfValue === "undefined") {
				console.log("***" + value + "*** should be a variable but is not found in metadata!!");
				vars.add(value);
			}
		}
	};
	walk(varsArray);
	return [...vars];
};


function checkVarsConsistency(precParams: any[] | null, params: any[], vars: string[]) {
	var varsSet = new Set(vars);
	var foundInPrecParams = new Set();
	var foundInParams = new Set();

	// precParams può essere nullo
	if (precParams !== null) {
		findVarsInStructure(precParams, varsSet, foundInPrecParams);
	}

	// params non è mai nullo
	findVarsInStructure(params, varsSet, foundInParams);

	var totalFound = foundInPrecParams.size + foundInParams.size;

	// Dovrebbe essere "==", ma se per qualche motivo uso la stessa var in precheck e check, viene contata 2 volte, quindi la somma aumenta.
	return (vars.length <= totalFound);
};


function findVarsInStructure(value: any[], varsSet: Set<string>, foundSet: Set<any>) {
  if (Array.isArray(value)) {
    for (const element of value) {
      findVarsInStructure(element, varsSet, foundSet);
    }
  } else if (typeof value === "string" && varsSet.has(value)) {
    foundSet.add(value);
  }
};


const missingParams = (recordData: REDCapRecord[], parameters: any[] | null, dqContext: DQContext) => {
	let result: any[] = [];
	let missingCount = 0;

	if (parameters === null) {
		// "result" è ancora undefined: viene ritornato per segnalare il problema (esiste una funzione ma non i corrispondenti params).
		return result;
	}

	// Estraggo tutti i nomi variabile da "params" o "precParams" (che non ha type fisso).
	const vars = extractVarsFromParams2(parameters, dqContext);
		
	// Se arrivo qui ho un check/precheck da eseguire e params/precParams non nullo, quindi vars (array delle variabili da verificare) non dovrebbe mai essere null.
	if (vars.length === 0){
		return result;
	}

	// Esclusi i casi problematici, result parte a false (passa a true quando una variabile è nulla, ovvero devo skippare il DQ check)
	result[0] = false;
	for (const element of vars) {
		// Per ogni variabile da controllare ne definisco instrument ed event per focalizzare il check solo sui record di dati corretti e non trovare falsi positivi nel check dei nulli.
		let v: any = element;
		let metadata = dqContext.metadata;
		let metadataOfV = metadata.find(item => item.field_name === v);

		if (typeof metadataOfV === "undefined") {
			console.log("***" + v + "*** is not a variable in metadata");
			return
		}

		let instrumentOfV = metadataOfV["form_name"];
		// Vista ipotesi Intrument appartiene a 1 solo Event: ok questa funzione (prende il primo evento).
		let eventOfV = getEventOfInstrument(instrumentOfV, dqContext);

		let myInstr = instrumentOfV;
		const iter = recordData.length;
		for (let i = 0; i < iter; i++) {
			let data = recordData[i];
			let instr = data["redcap_repeat_instrument"];
			let event = data["redcap_event_name"];
			if (event === eventOfV) {
				if (!(isVarRepeating(instrumentOfV, eventOfV, dqContext))){
					instrumentOfV = "";
				}
				if (instr === instrumentOfV){
					let valueOfV = data[v];
					// Se la seguente condizione è vera esiste un problema per la variabile v	
					if (valueOfV === ""){
						result[0] = true;
						missingCount = missingCount + 1;
						result[missingCount] = [event, myInstr, v];
					}
				}
			}
		}
	}

	return result;
};


const extractVarsFromParams2 = (parameters: any[], dqContext: DQContext) => {
	// Funzione per riconoscere quali sono le variabili dentro a params e precParams.
	// NOTA: arrivare qui dopo aver eseguito checkVarsConsistency dovrebbe garantire che non ci siano typo/nomi sbagliati tra quelli inclusi in precParams e params.
	// La funzione legge precParam ricorsivamente, qualsiasi sia la sua struttura, fino ad arrivare ai singoli token di tipo stringa.
  // Poi verifica se i singoli token si trovano nei metadata REDCap: queste sono le variabili.
	const foundVars = new Set();

	const walk = (value: any) => {
		// Eseguo ricorsivamente finché il type dell'espressione esaminata è un array. 
		if (Array.isArray(value)) {
			value.forEach(walk);
		} 
		// Se invece è stringa, valuto se esiste nei metadata (quindi se è una variabile).
		else if (
			typeof value === "string"
		) {
			// Verifico se value è una variabile esistente nei metadata REDCap; se sì la aggiungo alla lista di variabili da verificare
			let metadata = dqContext.metadata;
			let metadataOfValue = metadata.find(item => item.field_name === value);
			if (typeof metadataOfValue !== "undefined") {
				console.log("***" + value + "*** is a variable to be checked");
				foundVars.add(value);
			}
		}
	};

	walk(parameters);
	return [...foundVars];
};



// ---- FUNZIONE PRINCIPALE ----
export const DoDataQuality = async (
  recordData: REDCapRecord[],
  centerUrl: string,
  token: string
): Promise<DQRecord | null> => {
  // Chiamate API per ottenere i dati che mi servono
    // Metadata
	let metadata = await getMetadata(centerUrl, token);
    // Instrument vs Event
	let instrumentsVsEvents = await getInstrVsEvents(centerUrl, token);
  	// Repeatings
	let repeatingInstrumentsAndEvents = await getRepeatings(centerUrl, token);

  // Verifico che nessuno dei valori necessari sia nullo
  if (recordData === null || metadata === null || instrumentsVsEvents === null || repeatingInstrumentsAndEvents === null) {
    return null;
  }

  // Creo l'oggetto dqContext, il quale specifica il contesto su cui eseguirò la Data Quality
  const dqContext: DQContext = {
    data: recordData,
    metadata: metadata,
    instrumentsVsEvents: instrumentsVsEvents,
    repeatingInstrumentsAndEvents: repeatingInstrumentsAndEvents
  }

	// IPOTESI FORTE: una variabile (quindi un Instrument) appartiene ad un solo Event.
	// Questo è vero per EHE, ma non lo è in generale.

	const results: any = {};

	// ATTENZIONE! CHECK con variabili che non trova in Metadata per branching:
	  // dq_6_26, dq_6_27, dq_6_28, dq_6_29, dq_6_31,
    // dq_6_51, dq_6_86, dq_6_99, dq_6_101, dq_6_101b/c/d/e/f/g,
    // dq_8_26, dq_8_27, dq_8_28, dq_8_29, dq_8_31, dq_8_77, dq_8_90

	let whiteChecks: string[] = [];
	
	// Qui inserisco il check dei missing (deve essere fatto una sola volta per ogni riga analizzata, per tutte le variabili del REDCap).
	// Il criterio è la branching logic soddisfatta. Se sì, mi aspetto che var sia valorizzata. Se no, var va conteggiata come missing.

	// Dynamically execute each check based on the configuration
	dqChecks.forEach(check => {

		// Per limitare esecuzione a record selezionati
		if (typeof whiteChecks !== "undefined" && (whiteChecks.length === 0 || whiteChecks.includes(check.name))) {
			// Prendo la variabile "di riferimento" del check (mainVar)
			let mainVar = check.params[0];

			// Alcuni params sono a loro volta dei vettori; in quel caso prendo il primo valore.
			if (Array.isArray(mainVar)) {
				mainVar = mainVar[0];
			}

			let metadataOfMainVar = metadata.find(item => item.field_name === mainVar);

			// Gestisco il caso in cui ci siano delle variabili che non sono in metadata.
			if (typeof metadataOfMainVar === "undefined") {
				console.log("***" + mainVar + "*** is not a variable in metadata.");
				return null;
			}

			let instrumentOfMainVar = metadataOfMainVar["form_name"];

      //Vista ipotesi Intrument apparteiene a 1 solo Event: ok questa funzione (prende il primo evento)
			let eventOfMainVar = getEventOfInstrument(instrumentOfMainVar, dqContext);
      if (eventOfMainVar === null) {
        return null;
      }

			// Un check è repeating se la mainVar è repeating
			// Quindi, sotto le nostre ipotesi:
			//	0 - Instrument REP senza eventi (Non Longitudinale)
			//	1 - Instrument REP in Event NON_REP
			//	2 - Instrument NON_REP in Event REP

			const stopDq1 = ['dq_1_12', 'dq_1_27', 'dq_1_28','dq_3_1','dq_4_1','dq_9_1'];
			if (stopDq1.includes(check.name)) {
				console.log("Stop here!");
			}

			let isRepeating = isVarRepeating(instrumentOfMainVar, eventOfMainVar, dqContext);

			let varsArray = check.vars;
			
			let bLogicPassed = false;

			// Se NON repeating => esecuzione singola
			if (!isRepeating) {
				// 1 - Controlla branching
				// Calcola branching logic di ciascuna: true se tutte true (quindi in AND) 
				let branchingPassed: any;
				let noBranchingInCheck = true;
				// Per ogni variabile interessata dal check corrente...
				varsArray.forEach(checkVarName => {
					let metadataElem = metadata.find(item => item.field_name === checkVarName);
					// Gestisco il caso in cui ci siano delle variabili che non sono in metadata
					if (typeof metadataElem === "undefined") {
						console.log("***" + checkVarName + "*** is not a variable in metadata");
						return null;
					}
					if (varHasBranchingLogic(metadataElem)) {
						noBranchingInCheck = false;
						// Inizializzo branchingpassed solo se c'è almeno una branching
						if (typeof branchingPassed === "undefined" && branchingPassed === undefined) {
							branchingPassed = true;
						}
						// Visto che uso && eseguo branching solo se quelle prima sono passate
						branchingPassed = branchingPassed && runBranchingLogic(metadataElem, isRepeating, null, dqContext);
					}
				})
				bLogicPassed = branchingPassed || noBranchingInCheck;

        // 2 - Pre-check
				// Se tutte le var interessate passano la branching
				if (noBranchingInCheck || branchingPassed) {
					let precheckAvailable;
					let precheckPassed;
					if (check.prec != null && typeof check.prec === 'function') {
						precheckAvailable = true;
						precheckPassed = check.prec(recordData, ...(check.precParams ?? []));
					}
          else {
						precheckAvailable = false;
					}
	
					// 3 - Check
					if (!precheckAvailable || precheckPassed) {
						let checkResult = check.func(recordData, ...check.params);
						results[check.name] = checkResult;
					}
        }
			} 

      // Se repeating => esecuzione multipla
			else if (isRepeating) {
				// Valuto ogni istanza di mainVar separatamente
				let rowsOfDataForMainVar = getRowsOfDataForRepeatingVar(instrumentOfMainVar, eventOfMainVar, dqContext);
        if (rowsOfDataForMainVar === false) {
          return null;
        }

				rowsOfDataForMainVar.forEach(dataInstance => {
					let instanceNum = (dataInstance["redcap_repeat_instance"] ? dataInstance["redcap_repeat_instance"] : 0);

					// 1 - Controlla branching
					// Calcola branching logic di ciascuna: true se tutte true (quindi in AND) 
					let branchingPassed: any;
					let noBranchingInCheck = true;
					//per ogni variabile interessata dal check corrente...
					varsArray.forEach(checkVarName => {
						let metadataElem = metadata.find(item => item.field_name === checkVarName);
						if (typeof metadataElem === "undefined") {
							console.log("***" + checkVarName + "*** is not a variable in metadata");
							return null;
						}
						if (varHasBranchingLogic(metadataElem)) {
							noBranchingInCheck = false;
							// Inizializzo branchingpassed solo se c'è almeno una branching
							if (typeof branchingPassed === "undefined" && branchingPassed === undefined) {
								branchingPassed = true;
							}
							// Visto che uso && eseguo branching solo se quelle prima sono passate
							branchingPassed = branchingPassed && runBranchingLogic(metadataElem, isRepeating, instanceNum, dqContext);
						}
					})
					bLogicPassed = branchingPassed || noBranchingInCheck;
				});
			}
			
			let precheckPass = true;

			// Verifica risultato funzione principale solo per NON repeating
			if (!isRepeating) {
				if (!bLogicPassed) {
					// Se è un NON repeating, ma ho avuto fail nelle branching, fisso results (#fail) a 0.
					// Lo fisso a zero perché fail nella branching significa che non mi aspetto che il check debba essere fatto.
					results[check.name + " - " + check.desc] = 0;
					precheckPass = false;
				}
				else if (bLogicPassed) {
					// Lavoro basandomi su vars perché è l'unico elenco variabili che ha struttura fissa (array di stringhe); precParams e params hanno struttura variabile.
					// Verifico che tutte le vars elencate nel json di per quel DQ check esistano nei metadata. Solo se è così proseguo. Mi aspetto nonExistingVars vuoto.
					let nonExistingVars = nonexistentVars(check.vars, dqContext);
					if(nonExistingVars.length > 0){
						console.log("Error in the vars list for check " + check.name + ": ");
						nonExistingVars.forEach(function (v) {
							console.log(v);
						});
						return null;
					}
					// Se non ci sono variabili unknown nell'array vars proseguo
					else if (nonExistingVars.length === 0) {
						// Results contiene il numero di errori nelle branching logic (prima del check principale). Per un non repeating, se ho "bLogicPassed = true" significa che results (nr di fail) = 0.
						results[check.name + " - " + check.desc] = 0;
						// Verifico che tutte le variabili del vettore vars esistano in precParams e Params (se sì vuol dire che non ho typo).
            // Se sì proseguo, Se no mi fermo. Cosa faccio coi results? Tecnicamente non è un fail dei dati, ma un problema nella struttura della regola.
						let varConsistency = checkVarsConsistency(check.precParams, check.params, check.vars);
						if(!varConsistency){
							console.log("There are errors in precParams or params definition.");
							return null;
						}
						else if(varConsistency) {
							// Ora che ho accertato che non ci sono problemi con i nomi delle variabili.
							// Per tutte le funzioni (sia precheck, sia check) devo anche verificare che tutti gli instrument coinvolti siano completi, altrimenti passo al check seguente.
							  // Se ho precheck da valutare:
							if (check.prec != null && typeof check.prec === "function") {
								// Prima del precheck effettivo verifico se una o più variabili del precheck è nulla; se sì, non passo nemmeno a eseguire i precheck perché la regola non è rilevante.
                // precVarNull è true se almeno una delle variabili del precheck è nulla.
								const precVarIsNull = missingParams(recordData, check.precParams, dqContext);
								if (precVarIsNull === undefined || precVarIsNull.length === 0) {
									console.log("Problem case: precParam are not specified for function prec or REDCap variables are not recognized in precParam.");
									//return precVarIsNull;
                  return null;
								}
								else if (precVarIsNull[0] === true) {
									// In questo caso esco dal DQ check corrente senza ulteriori problemi; semplicemente non è applicabile.
									results[check.name + " - " + check.desc] = 0;
									  // allResults[0] = results;
									  // allResults[1] = missings;
									  // return allResults;
									return results;
								}
                // Solo se tutte le variabili del precheck sono NON nulle (confronto stretto "precVarIsNull === false"), proseguo con la valutazione di precheck e funzioni successive, altrimenti salto alla prossima DQ rule.
								else if (precVarIsNull[0] === false){
									// A questo punto results continua ad essere 0 (la non applicabilità del precheck non implica errore).
									results[check.name + " - " + check.desc] = 0;
									// Evaluate the precheck
									const result = check.prec(recordData, ...(check.precParams ?? []));
                    // Store "PASS" or "FAIL" based on the result
                    // results[check.name + " - " + check.desc] = result ? "PASS" : "FAIL";
									if (typeof result === "boolean") {
										console.log("The precheck result is a boolean.");
										if (!result) {
											//se il precheck non è verificato, il DQ check attuale non è applicabile (results 0) e salto al prossimo (return).
											precheckPass = false;
											results[check.name + " - " + check.desc] = 0;
											console.log("The precheck failed. Next DQ check");
									      // allResults[0] = results;
											  // allResults[1] = missings;
											  // return allResults;
											return results;
										}
										//results[check.name + ' - ' + check.desc] = result ? '' : '1';
									}
                  else if (typeof result === "object" && result !== null) {
										console.log("The precheck result is an object.");
										const errored = Object.values(result).filter(value => value === false).length;
										console.log(" - nr of errors in the precheck = " + errored);
										if (errored == 0) {
											//results[check.name + " - " + check.desc] = "";
											results[check.name + " - " + check.desc] = 0;
										}
										else {
											// Se almeno un precheck non è verificato, il DQ check attuale non è applicabile (results 0) e salto al prossimo (return).
											precheckPass = false;
											results[check.name + " - " + check.desc] = 0;
								        // allResults[0] = results;
							          // allResults[1] = missings;
									      // return allResults;
											return results;
										}
									}
								} // end if (precVarIsNull === false) {
							} // end if (check.prec != null && typeof check.prec === "function")
							
							/////////////////////////////////////////////////////////////////////////////////////////////////////////
							// VERIFICA CHECK PRINCIPALI (nota: qui entro solo se NON repeating)
							/////////////////////////////////////////////////////////////////////////////////////////////////////////
							if(!precheckPass) {
								// Se ho avuto fail nel precheck fisso results (#fail) a 1
								results[check.name + " - " + check.desc] = 0;
								console.log("Failed precheck. go to next DQ check");
								  // allResults[0] = results;
								  // allResults[1] = missings;
								  // return allResults;
								return results;
							}
							// Se ho passato i precheck:
							else if (precheckPass) {
								// "results" contiene il numero di errori nelle branching logic (prima del check principale).
                // Per un non repeating, se ho "bLogicPassed = true" significa che results (#fail) = 0.
								results[check.name + " - " + check.desc] = 0;
								// Prima di valutare i check, verifico se ho variabili nulle (come ho fatto nei precheck).
                // In questo caso, però, se ho dei null imposto il check a FAIL e passo al prossimo DQ check.
								// "anyVarNull" è true se almeno una delle variabili del check è nulla.
								const anyVarIsNull = missingParams(recordData, check.params, dqContext);
								console.log("Any params variable is null = " + anyVarIsNull);
								if (anyVarIsNull === undefined || anyVarIsNull.length === 0){
									console.log("Problem case: params are not specified for function main or REDCap variables are not recognized in params.");
									//return anyVarIsNull;
                  return null;
								}
								else if (anyVarIsNull[0] === true){
									// In questo caso esco dal DQ check corrente senza ulteriori problemi; semplicemente non è applicabile.
									results[check.name + " - " + check.desc] = 0;
									  // for (let i = 1; i < anyVarIsNull.length; i++){
										//   missings[anyVarIsNull[i][2]] = anyVarIsNull[i];
									  // }
									  // allResults[0] = results;
									  // allResults[1] = missings;
									  // return allResults;
									return results;
								}
								// Se è andato tutto liscio e non ho var nulle nei params faccio i check.
								// Evaluate the check
								const result = check.func(recordData, ...check.params);
                  // Store "PASS" or "FAIL" based on the result.
                  // results[check.name + " - " + check.desc] = result ? "PASS" : "FAIL";
								if (typeof result === "boolean") {
									console.log("The result is a boolean.");
									if (!result) {
										results[check.name + " - " + check.desc] = 1;
									}
								} else if (typeof result === "object" && result !== null) {
									console.log("The result is an object.");
									const errored = Object.values(result).filter(value => value === false).length;
									console.log(" - nr of errors = " + errored);
									if (errored == 0) {
										results[check.name + " - " + check.desc] = 0;
									}
									else {
										results[check.name + " - " + check.desc] = 1;
									}
								}
							} // end if(precheckPass)
						} // end if varconsistency
					} // end else if((nonExistingVars === null) || (nonExistingVars === undefined))
				} // end if(bLogicPassed) 
			}
			else {
				// Se è un repeating instrument fisso momentaneamente a -1000
				results[check.name + " - " + check.desc] = -1000;
			}

			/////////////////////////////////////////////////////////////////////////////////////////////////////////
			// VERIFICA CHECK PRINCIPALI
			/////////////////////////////////////////////////////////////////////////////////////////////////////////

			// Verifica risultato funzione principale solo per NON repeating
			if (!isRepeating) {
				if(bLogicPassed) {
					// "results" contiene il numero di errori nelle branching logic (prima del check principale). Per un non repeating, se ho bLogicPassed true significa che results (#fail) = 0.
					results[check.name + " - " + check.desc] = 0;
					// Evaluate the check
					const result = check.func(recordData, ...check.params);
            // Store "PASS" or "FAIL" based on the result
            // results[check.name + " - " + check.desc] = result ? "PASS" : "FAIL";
					if (typeof result === "boolean") {
						console.log("The result is a boolean.");
						let resVal = results[check.name + " - " + check.desc];
						if (!result) {
							results[check.name + " - " + check.desc] = resVal + 1;
						}
					} else if (typeof result === "object" && result !== null) {
						console.log("The result is an object.");
						const errored = Object.values(result).filter(value => value === false).length;
						console.log(" - nr of errors = " + errored);
						if (errored == 0) {
							results[check.name + " - " + check.desc] = "";
						}
						else {
							let resVal = results[check.name + " - " + check.desc];
							results[check.name + " - " + check.desc] = resVal + errored;
						}
					}
				}
				else {
					// Se è un NON repeating ma ho avuto fail nelle branching fisso results (#fail) a 0.
					// Lo fisso a 0 perché se le branching hanno fail vuol dire che la var non mi aspetto sia valorizzata.
					results[check.name + " - " + check.desc] = 0;
				}
			}
			else {
				// Se è un repeating instrument fisso momentaneamente a -1000.
				results[check.name + " - " + check.desc] = -1000;
			}
		}
	});
    // allResults[0] = results;
    // allResults[1] = missings;
    // return allResults;
	return results;
};
