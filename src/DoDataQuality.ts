import { dqChecks } from "@/utils/config-dqchecks";
import type { REDCapRecord, DQRecord, DQContext, REDCapMetadataField, BranchRefVar, VariableRef, REDCapInstrVsEventsField, REDCapRepeatingsField } from "@/utils/types";


export const getEventOfInstrument = (
  dqContext: DQContext,
  instrument: string
) => {
	let instrumentsVsEvents = dqContext.instrumentsVsEvents;
  const found = instrumentsVsEvents.find(item => item.form === instrument);

  if (found === undefined) {
    return null;
  }
  else {
    return found.unique_event_name;
  }
};


export const isVarRepeating = (
  repeatingInstrumentsAndEvents: REDCapRepeatingsField[],
  instr: string,
  event: string | null
) => {
  const eventIsRep = repeatingInstrumentsAndEvents.some(item => item.event_name === event);

  if (eventIsRep) {
    // La variabile è repeating se appartiene a event repeating e instrument repeating.
    let instrIsRep = repeatingInstrumentsAndEvents.some(item => item.form_name === instr);
    // Sintassi con !! ritorna "true" se instrIsRep è truthy, "false" se instrIsRep è falsy.
    return !!(instrIsRep);
  } 
  else {
    return false;
  }
};


export const varHasBranchingLogic = (metadataElem: REDCapMetadataField) => {
	if (metadataElem.branching_logic) {
		return true;
	}
  else {
		return false;
	}
};


export const runBranchingLogic = (
  dqContext: DQContext,
  metadataOfVar: REDCapMetadataField,
  instance: any
) => {
  // L'instance in input è l'istanza  di riferimento da usare in caso non ci sia dentro alla branching la specifica di quale istanza usare (si usa la stessa).
	// Branching logic, così come specificata su REDCap.
	let branchingOrigExpr = metadataOfVar["branching_logic"];

	// La variabile di riferimento per la branching.
	let branchRefVar: BranchRefVar = {
    name: metadataOfVar.field_name,
    instrument: metadataOfVar.form_name,
    event: getEventOfInstrument(dqContext, metadataOfVar.form_name)
  };
  // Evito errore di inutilizzo della variabile.
  if (branchRefVar === null) {
    console.log("Variabile Branching: ", branchRefVar);
  }

  let evaluableBranchLogicExpr = compileBranchingLogicExpression(dqContext, branchingOrigExpr, instance);
  let result = null;
  if (evaluableBranchLogicExpr != "") {
    result = evalRedcap(evaluableBranchLogicExpr);
  }
  return result;
};


const compileBranchingLogicExpression = (
  dqContext: DQContext,
  branchingOrigExpr: string,
  instance: any = null
) => {
  const ROW_TYPE_MAPPING = [
		{ instrument: "", event: "baseline_arm_1", tipoRow: "baseline_and_treatment_at_first_presentation" },
		{ instrument: "unifocal_followup", event: "unifocal_arm_1", tipoRow: "unifocal_followup" },
		{ instrument: "unifocal_local_recurrence", event: "unifocal_arm_1", tipoRow: "unifocal_local_recurrence" },
		{ instrument: "", event: "unifocal_arm_1", tipoRow: "unifocal_distant_metastases" },
		{ instrument: "locoregional_followup", event: "locoregional_arm_1", tipoRow: "locoregional_followup" },
		{ instrument: "locoregional_progression", event: "locoregional_arm_1", tipoRow: "locoregional_progression" },
		{ instrument: "systemic_metastases_followup", event: "systemic_metastase_arm_1", tipoRow: "systemic_metastases_followup" },
		{ instrument: "systemic_metastases_progression", event: "systemic_metastase_arm_1", tipoRow: "systemic_metastases_progression" },
		{ instrument: "", event: "life_status__clini_arm_1", tipoRow: "life_status_update" },
	];

  // Estraggo le variabili dentro la branching logic e ciascuna diventa un oggetto con 6 proprietà:
  //  1. event -> evento della var (può essere nullo se non è esplicitato nella branching expression).
  //  2. field -> nome della variabile (nei check segue la sua convenzione).
  //  3. instance -> instance (può essere nulla). Quando ha valore può essere:
  //      A. [current-instance] = refers to the current instance.
  //			B. [previous-instance] = refers to the instance immediately previous.
  //			C. [next-instance] = refers to the instance immediately after.
  //			D. [first-instance] = refers back to the very first instance.
  //			E. [last-instance] = refers back to the very last instance.
  //  4. orig -> come dichiarata in branching expression.
  //  5. realField -> nome della variabile come in redcap data (diverso da field nel caso dei checkbox).
  //  6. realVar -> nome della variabile come in redcap metadata (diverso da field nel caso dei checkbox).
  let varsInBranching = extractRedcapVariables(dqContext, branchingOrigExpr);

  // Espressione in cui sostituiremo valori e operatori per renderla interpretabile da JS.
  let workingBranchExpression = branchingOrigExpr;

  // Per ogni variabile della branching logic.
  varsInBranching.forEach(varOfBranching => {
    // Completare info su event mettendo quello di mainVar se non specificato.
    let completeVar = varOfBranching;

    if (completeVar.event == null) {
      const metadataVar = dqContext.metadata.find(
        item => item.field_name === completeVar.realVar
      );
      if (metadataVar) {
        completeVar.instrument = metadataVar.form_name;
        const mapping = ROW_TYPE_MAPPING.find(
          item => item.tipoRow === metadataVar.form_name
        );
        if (mapping) {
          completeVar.event = mapping.event;
        }
      }
    }

    // Istruzione per fermare esecuzione quando instance della variabile estratta dalla branching è last-intance.
    if (typeof varOfBranching.instance === "string" && varOfBranching.instance.includes("-instance")) {
      const availableInstances = dqContext.data
        .filter(row =>
          row.redcap_event_name === completeVar.event &&
          row.redcap_repeat_instrument === completeVar.instrument &&
          row.redcap_repeat_instance !== null &&
          row.redcap_repeat_instance !== ""
        )
        .map(row => Number(row.redcap_repeat_instance))
        .filter(Number.isFinite)
        .sort((a, b) => a - b);
      const currentIndex = availableInstances.indexOf(Number(instance));
      let targetInstance = null;
      switch (varOfBranching.instance) {
        case "current-instance":
          targetInstance = (currentIndex >= 0)
            ? availableInstances[currentIndex]
            : null;
          break;
        case "previous-instance":
          targetInstance = (currentIndex > 0)
            ? availableInstances[currentIndex - 1]
            : null;
          break;
        case "next-instance":
          targetInstance = (currentIndex >= 0 && currentIndex < availableInstances.length - 1)
            ? availableInstances[currentIndex + 1]
            : null;
          break;
        case "first-instance":
          targetInstance = availableInstances.length > 0
            ? availableInstances[0]
            : null;
          break;

        case "last-instance":
          targetInstance = availableInstances.length > 0
            ? availableInstances[availableInstances.length - 1]
            : null;
          break;
      }
      completeVar.targetInstance = targetInstance;
    }

    // Prendere Data row che contiene la variabile corrente.
    let rightData4Var = getFirstEventFromDataForVar(dqContext, completeVar, instance );

    // Se quella riga esiste...
    if (rightData4Var) {
      workingBranchExpression = replaceVarWithValue(workingBranchExpression, varOfBranching, rightData4Var);
    }
    // ..., altrimenti:
    else {
      workingBranchExpression = workingBranchExpression.replaceAll(varOfBranching.orig, "\'\'");
    }

    // Sostituire operatori e operandi.
    workingBranchExpression = translateRedcapToJs(workingBranchExpression, { strict: false });

  });
  
  return workingBranchExpression;
};


export const evalRedcap = (
  jsExpr: string,
  { fallback = false } = {}
) => {
	try {
		// Coerzione e trimming minimi: non trasformo altro.
		const s = String(jsExpr ?? "").trim();

		// Se vuoto, ritorno il fallback (evita "return ()" -> SyntaxError).
		if (!s) {
			return fallback;
		}

		// Valutazione come espressione
		return Function(`"use strict"; return (${s});`)();

	} catch (err) {
		// Log chiaro e callback opzionale.
		console.error("[evalRedcap] Errore durante la valutazione:", err);
		console.error("[evalRedcap] Espressione non valutabile:", jsExpr);
		return fallback;
	}
};


export const extractRedcapVariables = (
  dqContext: DQContext,
  logic: string
) => {
	// matcha sequenze tipo: [xxx][yyy][zzz] (token completo)
	const tokenRegex = /(\[[^\]]+\])+/g;
	// matcha singole [parte]
	const partRegex = /\[([^\]]+)\]/g;

	const results = [];
	const seen = new Set();  // evita duplicati "per variabile" (non per posizione)

	// regex per estrarre "nomeCampo(numero)" alla fine del nome campo.
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
      raw: null,
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
			}
      else {
				variable.realVar = variable.field;
				variable.realField = variable.field;
			}
		}

		// De-duplicazione basata su event/field/instance.
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


export const getFirstEventFromDataForVar = (
  dqContext: DQContext,
  variable: VariableRef,
  contextInstance: string | null
) => {
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
  if (!instKeyword || !String(instKeyword).includes("-instance")) {
    // NO repeating instrument (baseline rows)
    const nonRepeating = eventRows.find(
      r =>
        (!r.redcap_repeat_instrument || r.redcap_repeat_instrument === "")
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
    case "first-instance":
      return sorted[0];
    case "last-instance":
      return sorted[sorted.length - 1];
    case "current-instance":
      return sorted.find(r =>
        Number(r.redcap_repeat_instance) === current
      );
    case "previous-instance":
      return [...sorted]
        .reverse()
        .find(r =>
          Number(r.redcap_repeat_instance) < current
        );
    case "next-instance":
      return sorted.find(r =>
        Number(r.redcap_repeat_instance) > current
      );
    default:
      return sorted.find(r =>
        Number(r.redcap_repeat_instance) === current
      );
  }
};


export const getRowsOfDataForRepeatingVar = (
  dqContext: DQContext,
  instr: string,
  event: string
) => {
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


export const replaceVarWithValue = (
  expression: string,
  variable: VariableRef,
  dataRow: REDCapRecord
) => {
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


const nonexistentVars = (dqContext: DQContext, varsArray: string[]) => {
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
				//console.log("***" + value + "*** should be a variable but is not found in metadata!!");
				vars.add(value);
			}
		}
	};
	walk(varsArray);
	return [...vars];
};


function checkVarsConsistency(
  precParams: any[] | null,
  params: any[],
  vars: string[]
) {
	var varsSet = new Set(vars);
	var foundInPrecParams = new Set();
	var foundInParams = new Set();

	// precParams può essere nullo.
	if (precParams !== null) {
		findVarsInStructure(precParams, varsSet, foundInPrecParams);
	}

	// params non è mai nullo.
	findVarsInStructure(params, varsSet, foundInParams);

	var totalFound = foundInPrecParams.size + foundInParams.size;

	// Dovrebbe essere "==", ma se per qualche motivo uso la stessa var in precheck e check, viene contata 2 volte, quindi la somma aumenta.
	return (vars.length <= totalFound);
};


function findVarsInStructure(
  value: any[],
  varsSet: Set<string>,
  foundSet: Set<any>
) {
  if (Array.isArray(value)) {
    for (const element of value) {
      findVarsInStructure(element, varsSet, foundSet);
    }
  }
  else if (typeof value === "string" && varsSet.has(value)) {
    foundSet.add(value);
  }
};



// -----------------------------
// ---- FUNZIONE PRINCIPALE ----
// -----------------------------
export const DoDataQuality = async (
  recordData: REDCapRecord[],
  metadata: REDCapMetadataField[],
  instrumentsVsEvents: REDCapInstrVsEventsField[],
  repeatingInstrumentsAndEvents: REDCapRepeatingsField[]
): Promise<DQRecord | null> => {
  // Creo l'oggetto dqContext, il quale specifica il contesto su cui eseguirò la Data Quality.
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

	// Eseguire dinamicamente ogni controllo in base alla configurazione.
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
				//console.log("***" + mainVar + "*** is not a variable in metadata.");
				return null;
			}

			let instrumentOfMainVar = metadataOfMainVar["form_name"];

      // Vista ipotesi Intrument apparteiene a 1 solo Event: ok questa funzione (prende il primo evento).
			let eventOfMainVar = getEventOfInstrument(dqContext, instrumentOfMainVar);
      if (eventOfMainVar === null) {
        return null;
      }

			// Un check è repeating se la mainVar è repeating.
			// Quindi, sotto le nostre ipotesi:
			//	0 - Instrument REP senza eventi (Non Longitudinale)
			//	1 - Instrument REP in Event NON_REP
			//	2 - Instrument NON_REP in Event REP

			let isRepeating = isVarRepeating(repeatingInstrumentsAndEvents, instrumentOfMainVar, eventOfMainVar);

			let varsArray = check.vars;
			
			let bLogicPassed = true;

      // Verifico che tutte le vars elencate nel json per quel DQ check esistano nei metadata. Solo se è così proseguo. Mi aspetto nonExistingVars vuoto.
			let nonExistingVars = nonexistentVars(dqContext, check.vars);

      if (nonExistingVars.length > 0) {
        /*
				console.log("Error in the vars list for check " + check.name + ": ");
				nonExistingVars.forEach(function (v) {
					console.log(" - ", v);
				});
        */

				return;
			}

			// Se non ci sono errori nell'array delle vars (esistono tutte), verifico la consistenza tra gli array vars, precparams e params (sono scritti a mano quindi soggetti a errore).
			else if (nonExistingVars.length === 0) {
				// Verifico che tutte le variabili del vettore vars esistano in precParams e Params. Se sì (vuol dire che non ho typo) proseguo, altrimenti mi fermo.
				let varConsistency = checkVarsConsistency(check.precParams, check.params, check.vars);
				if (!varConsistency) {
					console.log("Ci sono uno o più errori nella definizione delle variabili in precParams e/o params!");
					return;
				}

				else if (varConsistency) {

          // Se NON repeating => esecuzione singola
          if (!isRepeating) {
            // Metto di default il result del controllo a "true" (cioè "non errore", che è già il valore giusto se fallisco le verifiche sula branching e sui precheck).
            // Eventualmente cambierà a "false" in fase di verifica del check principale, se fallisce.
						results[check.name + " - " + check.desc] = true;

            // 1 - Controlla branching
            // Calcola branching logic di ciascuna: true se tutte true (quindi in AND).
            let branchingPassed: any;
            let noBranchingInCheck = true;
            // Ciclo per ogni variabile interessata dal check corrente.
            varsArray.forEach(checkVarName => {
              let metadataElem = metadata.find(item => item.field_name === checkVarName);
              // Gestisco il caso in cui ci siano delle variabili che non sono in metadata.
              if (typeof metadataElem === "undefined") {
                //console.log("***" + checkVarName + "*** is not a variable in metadata");
                return null;
              }
              if (varHasBranchingLogic(metadataElem)) {
                noBranchingInCheck = false;
                // Inizializzo branchingpassed solo se c'è almeno una branching.
                if (typeof branchingPassed === "undefined" && branchingPassed === undefined) {
                  branchingPassed = true;
                }
                // Visto che uso && eseguo branching solo se quelle prima sono passate.
                branchingPassed = branchingPassed && runBranchingLogic(dqContext, metadataElem, null);
              }
            })
            bLogicPassed = bLogicPassed && (branchingPassed || noBranchingInCheck);

            // Se tutte le var interessate passano la branching proseguo alla verifica dei precheck.
            if (noBranchingInCheck || branchingPassed) {
              // 2 - Pre-check
              let precheckAvailable;
              let precheckPassed;
              // Se esiste un precheck nel DQ, allora setto precheckAvailable a "true" e proseguo a verificarlo (-> valore di precheckPassed).
              if (check.prec != null && typeof check.prec === "function") {
                precheckAvailable = true;
                precheckPassed = check.prec(recordData, ...(check.precParams ?? []));
              }
              // Se non esiste un precheck nel DQ, allora setto precheckAvailable a "false".
              else {
                precheckAvailable = false;
              }
              
              // Ultimo passo: verifica dei check (solo se tutti gli step precedenti passano).
              // 3 - Check
              if (!precheckAvailable || precheckPassed) {
                let checkResult = check.func(recordData, ...check.params);
                results[check.name + " - " + check.desc] = checkResult;
              }
            }
          } 

          // Se repeating => esecuzione multipla
          else if (isRepeating) {
            // Valuto ogni istanza di mainVar separatamente.
            let rowsOfDataForMainVar = getRowsOfDataForRepeatingVar(dqContext, instrumentOfMainVar, eventOfMainVar);
            if (rowsOfDataForMainVar === false) {
              return null;
            }

            // I prossimi step devono avvenire solo se nel Record ho effettivamente delle righe del tipo richiesto.
            // Altrimenti non ha senso controllare (nemmeno le branching logic). E per ogni riga del tipo giusto, faccio girare le verifiche della branching.
            // Se non ho righe del tipo giusto posso passare oltre col result a 0.
            if (rowsOfDataForMainVar.length > 0) {
              const partial: Record<any,any> = {};

              rowsOfDataForMainVar.forEach(dataInstance => {
                let instanceNum = (dataInstance["redcap_repeat_instance"] ? dataInstance["redcap_repeat_instance"] : 0);

                partial[instanceNum] = true;

                // 1 - Controlla branching
                // Calcola branching logic di ciascuna: true se tutte true (quindi in AND).
                let branchingPassed: any;
                let noBranchingInCheck = true;
                //let metadataVar;
                // Per ogni variabile interessata dal check corrente...
                varsArray.forEach(checkVarName => {
                  let metadataElem = metadata.find(item => item.field_name === checkVarName);
                  //metadataVar = metadataElem;
                  if (typeof metadataElem === "undefined") {
                    //console.log("***" + checkVarName + "*** is not a variable in metadata");
                    return null;
                  }
                  if (varHasBranchingLogic(metadataElem)) {
                    noBranchingInCheck = false;
                    // Inizializzo branchingpassed solo se c'è almeno una branching.
                    if (typeof branchingPassed === "undefined" && branchingPassed === undefined) {
                      branchingPassed = true;
                    }
                    // Visto che uso "&&"" eseguo branching solo se quelle prima sono passate.
                    branchingPassed = branchingPassed && runBranchingLogic(dqContext, metadataElem, instanceNum);
                  }
                  else {
                    branchingPassed = true;
                    noBranchingInCheck = true;
                  }

                  bLogicPassed = branchingPassed && (branchingPassed || noBranchingInCheck);
                })

                // Se tutte le var interessate passano la branching proseguo alla verifica dei precheck.
                if (bLogicPassed) {
                  // 2 - Pre-check
                  let precheckAvailable;
                  let precheckPassed;
                  // Se esiste un precheck nel DQ, allora setto precheckAvailable a "true" e proseguo a verificarlo (-> valore di precheckPassed).
                  if (check.prec != null && typeof check.prec === "function") {
                    precheckAvailable = true;
                    if ((check.prec.name == "multiVarHasValueOR") || (check.prec.name == "varHasValue")) {
											precheckPassed = check.prec(recordData, ...(check.precParams ?? []));
										}
										else {
											precheckPassed = check.prec(recordData, ...(check.precParams ?? []), dataInstance);
                    }
                  }
                  // Se non esiste un precheck nel DQ, allora setto precheckAvailable a "false".
                  else {
                    precheckAvailable = false;
                  }
          
                  // Ultimo passo: verifica dei check, che avviene solo se tutti gli step precedenti passano.
                  // 3 - Check
                  if (!precheckAvailable || precheckPassed) {
                    let checkResult = check.func(recordData, ...check.params, dataInstance);
                    partial[instanceNum] = checkResult;
                  }
                }
              });

              // I risultati di tipo "T/F" vengono convertiti in "1/0" per andare nel report.
              Object.keys(partial).forEach(key => {
                if (partial[key] === true) partial[key] = 0;
                else if (partial[key] === false) partial[key] = 1;
              });

              results[check.name + " - " + check.desc] = Object.values(partial).reduce((sum, value) => sum + value, 0);
            }

            else {
              // Se non trovo rows del tipo che mi interessa per la valutazione della variabile, allora posso già interrompere la valutazione del check mettendo "false".
              results[check.name + " - " + check.desc] = 0;
            }
			    }
        }
      }
		}
	});
    // allResults[0] = results;
    // allResults[1] = missings;
    // return allResults;
	return results;
};

// -------------
// ---- END ----
// -------------
