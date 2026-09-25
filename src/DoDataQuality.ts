import { getMetadata, getInstrVsEvents, getRepeatings } from "@/fetch/dq-fetch";
import { dqChecks } from "@/utils/config-dqchecks";
import type { REDCapRecord, DQRecord } from "@/utils/types";


export const DoDataQuality = async (
  recordData: REDCapRecord[],
  centerUrl: string,
  token: string
): Promise<DQRecord> => {
  // Chiamate API per ottenere i dati che mi servono
    // Metadata
	let metadata = await getMetadata(centerUrl, token);
    // Instrument vs Event
	// let instrumentsVsEvents = await getInstrVsEvents(centerUrl, token);
  	// Repeatings
	// let repeatingInstrumentsAndEvents = await getRepeatings(centerUrl, token);

	// IPOTESI FORTE: una variabile (quindi un Instrument) appartiene ad un solo Event.
	// Questo è vero per EHE, ma non lo è in generale.

	const results = {};

	// ATTENZIONE! CHECK con variabili che non trova in Metadata per branching:
	  // dq_6_26, dq_6_27, dq_6_28, dq_6_29, dq_6_31,
    // dq_6_51, dq_6_86, dq_6_99, dq_6_101, dq_6_101b/c/d/e/f/g,
    // dq_8_26, dq_8_27, dq_8_28, dq_8_29, dq_8_31, dq_8_77, dq_8_90

	let whiteChecks: string[] = [];
	
	// Qui inserisco il check dei missing (deve essere fatto una sola volta per ogni riga analizzata, per tutte le variabili del REDCap).
	// Il criterio è la branching logic soddisfatta. Se sì, mi aspetto che var sia valorizzata. Se no, var va conteggiata come missing.

	// Dynamically execute each check based on the configuration
	dqChecks.forEach(check => {

		//Per limitare esecuzione a record selezionati
		if (typeof whiteChecks !== "undefined" && (whiteChecks.length === 0 || whiteChecks.includes(check.name))) {

			console.log("\n");
			console.log(check);

			//Prendo la variabile "di riferimento" del check (mainVar)
			let mainVar = check.params[0];

			//Alcuni params sono a loro volta dei vettori (es. ["bl_123_surv_yn", 1]), in quel caso prendo il primo valore
			//TODO capire perchè queste matrici
			//credo dipenda dal fatto che prima eseguiva i check in un colpo solo per tutte le isytanze
			//ora dovremo sempificare le funzioni e ciclare sulle istanze all'esterno (come fa la branch var)
			//addirittura c'erano params dentro a matrici tridimensionakli [[[]]] .. in dq-checks-config3.js le ho ridotto a bidimensionali
			//
			//!!! mainVar è primo elemento param e se questo è ancora una array => primo elemento di nuovo
			if (Array.isArray(mainVar)) {
				mainVar = mainVar[0];
			}

			let metadataOfMainVar = metadata.find(item => item.field_name === mainVar);

			//gestisco caso in cui ci siano delle variabili che no nsono in metadata
			//TODO questo non deve succedere!!!
			if (typeof metadataOfMainVar === "undefined") {
				console.log("***" + mainVar + " is not a variable in metadata");
				return
			}

			let instrumentOfMainVar = metadataOfMainVar["form_name"];

			//Vista ipotesi Intrument apparteiene a 1 solo Event: ok questa funzione (prende il primo evento)
			let eventOfMainVar = getEventOfInstrument(instrumentOfMainVar);

			//Un check è repeating se la mainVar è repeating
			//Quindi, sotto le nostre ipotesi:
			//	0 - Instrument REP senza eventi (Non Longitudinale)
			//	1 - Instrument REP in Event NON_REP
			//	2 - Instrument NON_REP in Event REP

			//TODO REFACTOR_JUN26 : CLEAN
			//const stopDq1 = ['dq_1_12', 'dq_1_40', 'dq_4_3', 'dq_4_18', 'dq_4_19', 'dq_4_21', 'dq_4_22', 'dq_9_1'];
			const stopDq1 = ['dq_1_12', 'dq_1_27', 'dq_1_28','dq_3_1','dq_4_1','dq_9_1'];
			if(stopDq1.includes(check.name)){
				console.log("stop here");
			}

			let isRepeating = isVarRepeating(instrumentOfMainVar, eventOfMainVar)

			//TODO REFACTOR_JUN26 : not used? in case remove
			let varsArray = check.vars;
			
			let bLogicPassed = false;


			//se NON repeating => esecuzione singola
			if (!isRepeating) {
				console.log("Check NOT repeating");

				// 1 - controlla branching
				//Calcola branching logic di ciascuna: true se tutte true (quindi in AND) 
				let branchingPassed;
				let noBranchingInCheck = true;

				//per ogni variabile interessata dal check corrente...
				varsArray.forEach(checkVarName => {
					let metadataElem = metadata.find(item => item.field_name === checkVarName);

					//gestisco caso in cui ci siano delle variabili che no nsono in metadata
					//TODO questo non deve succedere!!!
					if (typeof metadataElem === "undefined") {
						console.log("***" + checkVarName + " is not a variable in metadata");
						return
					}

					if (varHasBranchingLogic(metadataElem)) {
						noBranchingInCheck = false;

						//inizializzo branchingpassed solo se c'è almeno una branching
						if (typeof branchingPassed === "undefined" && branchingPassed === undefined) {
							branchingPassed = true;
						}

						// visto che uso && eseguo branching solo se quelle prima sono passate
						branchingPassed = branchingPassed && runBranchingLogic(metadataElem, isRepeating, null);
					}
				})

				console.log("1: Branching -> " + (branchingPassed || noBranchingInCheck) + (noBranchingInCheck ? " (no branching)" : ""));


				bLogicPassed = branchingPassed || noBranchingInCheck;
				

				

				// se tutte le var interessate passano la branching
				if (noBranchingInCheck || branchingPassed) {
					// 2 - Pre-check
					let precheckAvailable;
					let precheckPassed;
					if (check.prec != null && typeof check.prec === 'function') {
						precheckAvailable = true;
						precheckPassed = check.prec(data, ...check.precParams);
						console.log("2: Pre-check -> " + precheckPassed);
					} else {
						precheckAvailable = false;
						console.log("2: Pre-check -> NA");
					}
	
	
					// 3 - Check
					if (!precheckAvailable || precheckPassed) {
						let checkResult = check.func(data, ...check.params);
						results[check.name] = checkResult;
						console.log("3: Check -> " + checkResult);
					}
	
				}

				


			} 

			else if (isRepeating) {
				console.log("Check REPEATING");

				//valuto ogni istanza di mainVar separatamente
				let rowsOfDataForMainVar = getRowsOfDataForRepeatingVar(instrumentOfMainVar, eventOfMainVar);

				rowsOfDataForMainVar.forEach(dataInstance => {
					let instanceNum = (dataInstance["redcap_repeat_instance"] ? dataInstance["redcap_repeat_instance"] : 0);
					console.log("instance: " + instanceNum);

					// 1 - controlla branching
					//Calcola branching logic di ciascuna: true se tutte true (quindi in AND) 
					let branchingPassed;
					let noBranchingInCheck = true;



					//elimino il check della branching logic che non serve
 
					//per ogni variabile interessata dal check corrente...
					varsArray.forEach(checkVarName => {
						let metadataElem = metadata.find(item => item.field_name === checkVarName);



						//gestisco caso in cui ci siano delle variabili che no nsono in metadata
						//TODO questo non deve succedere!!!
						if (typeof metadataElem === "undefined") {
							console.log("***" + checkVarName + " is not a variable in metadata");
							return
						}




						if (varHasBranchingLogic(metadataElem)) {
							noBranchingInCheck = false;

							//inizializzo branchingpassed solo se c'è almeno una branching
							if (typeof branchingPassed === "undefined" && branchingPassed === undefined) {
								branchingPassed = true;
							}

							// visto che uso && eseguo branching solo se quelle prima sono passate
							branchingPassed = branchingPassed && runBranchingLogic(metadataElem, isRepeating, instanceNum);
						}
					})

					console.log("1: Branching -> " + (branchingPassed || noBranchingInCheck) + (noBranchingInCheck ? " (no branching)" : ""));
					
					bLogicPassed = branchingPassed || noBranchingInCheck;


					//TODO inserire pre-check e check anche per repeating

				});
			}


			/////////////////////////////////////////////////////////////////////////////////////////////////////////
			//VERIFICA PRECHECK (sono fuori dall'if repeating!)
			/////////////////////////////////////////////////////////////////////////////////////////////////////////

			
			let precheckPass = true;


//			const stopDq = ['dq_1_27', 'dq_1_40', 'dq_1_48', 'dq_1_98', 'dq_4_1', 'dq_4_3', 'dq_4_18', 'dq_4_19', 'dq_4_21', 'dq_4_22'];
			const stopDq = ['dq_1_12', 'dq_1_27',  'dq_1_28','dq_3_1','dq_4_1','dq_9_1'];
			if(stopDq.includes(check.name)){
				console.log("stop here: " + check.name);
			}


			//verifica risultato funzione principale solo per NON repeating
			if (!isRepeating) {
				if(!bLogicPassed) {
					//se è un NON repeating ma ho avuto fail nelle branching fisso results (#fail) a 1
					//NO, lo fisso a zero perché fail nella branching significa solo che non mi aspetto che il check debba essere fatto
					results[check.name + ' - ' + check.desc] = 0;
					precheckPass = false;
				}
				else if(bLogicPassed) {
					//lavoro basandomi su vars perché è l'unico elenco variabili che ha struttura fissa (array di stringhe); precParams e params hanno struttura variabile
					
					//verifico che tutte le vars elencate nel json di per quel DQ check esistano nei metadata. Solo se è così proseguo. Mi aspetto nonExistingVars vuoto
					let nonExistingVars = nonexistentVars(check.vars);

					if(nonExistingVars.length > 0){
						console.log("error in the vars list for check " + check.name + ": ");
						nonExistingVars.forEach(function (v) {
							console.log(v);
						});
						return;
					}
					//se non ci sono variabili unknown nell'array vars proseguo
					else if(nonExistingVars.length === 0){
						
						//results contiene il numero di errori nelle branching logic (prima del check principale). Per un non repeating, se ho bLogicPassed true significa che results (nr di fail) = 0
						results[check.name + ' - ' + check.desc] = 0;

						//verifico che tutte le variabili del vettore vars esistano in precParams e Params (se sì vuol dire che non ho typo). Se sì proseguo, altrimenti mi fermo (cosa faccio coi results? tecnicamente non è un fail dei dati ma 
						//un problema nella struttura della regola)
						let varConsistency = checkVarsConsistency(check.precParams, check.params, check.vars);

						if(!varConsistency){
							console.log("ci sono uno o più errori nella definizione delle variabili in precParams e/o params!");
							return;
						}
						else if(varConsistency){

							//ora che ho accertato che non ci sono problemi con i nomi delle variabili,
							// per tutte le funzioni sia precheck che check devo anche verificare che tutti gli instrument coinvolti siano complete, altrimenti passo al check seguente
							
							//se ho precheck da valutare
							if (check.prec != null && typeof check.prec === 'function') {

								//prima del precheck effettivo verifico se una o più variabili del precheck è nulla; se sì non passo nemmeno a eseguire i precheck perché la regola non è rilevante

		//						precVarNull è true se almeno una delle variabili del precheck è nulla
								const precVarIsNull = missingParams(data, check.precParams);

								if (precVarIsNull.length === 0){
									console.log("caso problematico: non sono specificati precParam per la funzione prec oppure in precParam non vengono riconosciute variabili di REDCap");
									return precVarIsNull;
								}
								else if (precVarIsNull[0] === true){
									//in questo caso esco dal DQ check corrente senza ulteriori problemi; semplicemente non è applicabile
									results[check.name + ' - ' + check.desc] = 0;

//									allResults[0] = results;
//									allResults[1] = missings;
//									
//									return allResults;
									return results;
								}
		//						solo se tutte le variabili del precheck sono NON nulle (confronto stretto "precVarIsNull === false"), proseguo con la valutazione della funzione precheck e successive; 
		// 						altrimenti salto alla prossima DQ rule
								else if (precVarIsNull[0] === false){
									//a questo punto results continua ad essere 0 (la non applicabilità del precheck non implica errore)
									results[check.name + ' - ' + check.desc] = 0;

									// Evaluate the precheck
									const result = check.prec(data, ...check.precParams);

									// Store 'PASS' or 'FAIL' based on the result
									//results[check.name + ' - ' + check.desc] = result ? 'PASS' : 'FAIL';

									if (typeof result === 'boolean') {
										console.log('The precheck result is a boolean.');
										let resVal = results[check.name + ' - ' + check.desc];

										if (!result) {
											//se il precheck non è verificato, il DQ check attuale non è applicabile (results 0) e salto al prossimo (return)
											precheckPass = false;
											results[check.name + ' - ' + check.desc] = 0;

											console.log('The precheck failed. Next DQ check');
											
//											allResults[0] = results;
//											allResults[1] = missings;
//									
//											return allResults;
											return results;
										}
										//results[check.name + ' - ' + check.desc] = result ? '' : '1';
									} else if (typeof result === 'object' && result !== null) {
										console.log('The precheck result is an object.');
										const errored = Object.values(result).filter(value => value === false).length;
										console.log("nr of errors in the precheck = " + errored);
										if (errored == 0) {
											//results[check.name + ' - ' + check.desc] = '';
											results[check.name + ' - ' + check.desc] = 0;
										}
										else {
											let resVal = results[check.name + ' - ' + check.desc];
											
											//se almeno un precheck non è verificato, il DQ check attuale non è applicabile (results 0) e salto al prossimo (return)
											precheckPass = false;
											results[check.name + ' - ' + check.desc] = 0;
											
//											allResults[0] = results;
//											allResults[1] = missings;
//
//											return allResults;
											return results;
										}
									}

								} //end if (precVarIsNull === false){
							} //end if (check.prec != null && typeof check.prec === 'function')
							
							/////////////////////////////////////////////////////////////////////////////////////////////////////////
							//VERIFICA CHECK PRINCIPALI (nota: qui entro solo se NON repeating)
							/////////////////////////////////////////////////////////////////////////////////////////////////////////

							//const stopDq = ['dq_1_27', 'dq_1_40', 'dq_1_48', 'dq_1_98', 'dq_4_1', 'dq_4_3', 'dq_4_18', 'dq_4_19', 'dq_4_21', 'dq_4_22'];
							
							/*
							const stopDq = ['dq_4_1', 'dq_9_1'];
							if(stopDq.includes(check.name)){
								console.log("stop here");
							}
							*/

							if(!precheckPass) {
								//se ho avuto fail nel precheck fisso results (#fail) a 1
								results[check.name + ' - ' + check.desc] = 0;
								
								console.log("failed precheck. go to next DQ check");
											
//								allResults[0] = results;
//								allResults[1] = missings;
//
//								return allResults;
								return results;
							}
							//se ho passato i precheck (quindi sono in una situazione per cui non ho null e sono nel contesto in cui )
							else if(precheckPass) {
								//results contiene il numero di errori nelle branching logic (prima del check principale). Per un non repeating, se ho bLogicPassed true significa che results (#fail) = 0
								results[check.name + ' - ' + check.desc] = 0;


								//prima di valutare i check, verifico se ho variabili nulle (come ho fatto nei precheck). In questo caso però se ho dei null imposto il check a FAIL e passo al prossimo DQ check
								//anyVarNull è true se almeno una delle variabili del check è nulla
								const anyVarIsNull = missingParams(data, check.params);

								console.log("any params variable is null = " + anyVarIsNull);
								
								if (anyVarIsNull.length === 0){
									console.log("caso problematico: non sono specificati params per la funzione main oppure in params non vengono riconosciute variabili di REDCap");
									return anyVarIsNull;
								}
								else if (anyVarIsNull[0] === true){
									//in questo caso esco dal DQ check corrente senza ulteriori problemi; semplicemente non è applicabile
									results[check.name + ' - ' + check.desc] = 0;

//									for (let i = 1; i < anyVarIsNull.length; i++){
//										missings[anyVarIsNull[i][2]] = anyVarIsNull[i];
//									}
//									
//									allResults[0] = results;
//									allResults[1] = missings;
//
//									return allResults;
									return results;
								}

								//se è andato tutto liscio e non ho var nulle nei params faccio i check
								//else if (anyVarIsNull === false){




								// Evaluate the check
								const result = check.func(data, ...check.params);

								// Store 'PASS' or 'FAIL' based on the result
								//			results[check.name + ' - ' + check.desc] = result ? 'PASS' : 'FAIL';

								if (typeof result === 'boolean') {
									console.log('The result is a boolean.');
									let resVal = results[check.name + ' - ' + check.desc];
									if (!result) {
										//results[check.name + ' - ' + check.desc] = resVal + 1;
										results[check.name + ' - ' + check.desc] = 1;

									}
									//				results[check.name + ' - ' + check.desc] = result ? '' : '1';
								} else if (typeof result === 'object' && result !== null) {
									console.log('The result is an object.');
									const errored = Object.values(result).filter(value => value === false).length;
									console.log("nr of errors = " + errored);
									if (errored == 0) {
										//results[check.name + ' - ' + check.desc] = '';
										results[check.name + ' - ' + check.desc] = 0;
									}
									else {
										let resVal = results[check.name + ' - ' + check.desc];
										//results[check.name + ' - ' + check.desc] = resVal + errored;
										results[check.name + ' - ' + check.desc] = 1;
									}
								}
							} //end if(precheckPass)
							
						}//end if varconsistency
					}//end else if((nonExistingVars === null) || (nonExistingVars === undefined))
				} //end if(bLogicPassed) 
				

				

				

			}

			else {
				//se è un repeating instrument fisso momentaneamente a -1000
				results[check.name + ' - ' + check.desc] = -1000;
			}


			

			/////////////////////////////////////////////////////////////////////////////////////////////////////////
			//VERIFICA CHECK PRINCIPALI
			/////////////////////////////////////////////////////////////////////////////////////////////////////////
//			const stopDq = ['dq_1_27', 'dq_1_40', 'dq_1_48', 'dq_1_98', 'dq_4_1', 'dq_4_3', 'dq_4_18', 'dq_4_19', 'dq_4_21', 'dq_4_22'];
//			const stopDq2 = ['dq_4_3', 'dq_4_18', 'dq_4_19', 'dq_4_21', 'dq_4_22'];
			const stopDq2 = ['dq_1_12', 'dq_1_27',  'dq_1_28','dq_3_1','dq_4_1','dq_9_1'];

			if(stopDq2.includes(check.name)){
				console.log("stop here");
			}

			//verifica risultato funzione principale solo per NON repeating
			if (!isRepeating) {

				///////////////////////qui sotto devo aggiungere anche && precheckPassed alla condizione di if?
				if(bLogicPassed) {
					//results contiene il numero di errori nelle branching logic (prima del check principale). Per un non repeating, se ho bLogicPassed true significa che results (#fail) = 0
					results[check.name + ' - ' + check.desc] = 0;





					// Evaluate the check
					const result = check.func(data, ...check.params);

					// Store 'PASS' or 'FAIL' based on the result
					//			results[check.name + ' - ' + check.desc] = result ? 'PASS' : 'FAIL';

					if (typeof result === 'boolean') {
						console.log('The result is a boolean.');
						let resVal = results[check.name + ' - ' + check.desc];
						if (!result) {
							results[check.name + ' - ' + check.desc] = resVal + 1;
						}
						//				results[check.name + ' - ' + check.desc] = result ? '' : '1';
					} else if (typeof result === 'object' && result !== null) {
						console.log('The result is an object.');
						const errored = Object.values(result).filter(value => value === false).length;
						console.log("nr of errors = " + errored);
						if (errored == 0) {
							//results[check.name + ' - ' + check.desc] = '';
						}
						else {
							let resVal = results[check.name + ' - ' + check.desc];
							results[check.name + ' - ' + check.desc] = resVal + errored;
						}
					}







				}
				else {
					//se è un NON repeating ma ho avuto fail nelle branching fisso results (#fail) a 1
					//NO, lo fisso a 0 perché se le branching hanno fail vuol dire che la var non mi aspetto sia valorizzata
					results[check.name + ' - ' + check.desc] = 0;
				}

			}
			else {
				//se è un repeating instrument fisso momentaneamente a -1000
				results[check.name + ' - ' + check.desc] = -1000;
			}













/*

			//vecchio codice
			const false_ = false;
			if (false_) {



				//console.log(check.name);
				let precErrored = 0;
				results[check.desc] = '';





				//if (typeof check.func === 'function') {


				//if a pre-check must be performed
				if (check.prec != null && typeof check.prec === 'function') {
					let precPass = check.prec(data, ...check.precParams);

					if (typeof precPass === 'boolean') {
						//console.log('The precResult is a boolean.');
						results[check.desc] = precPass ? '' : '1000';
						if (!precPass) {
							//					results[check.name + ' - ' + check.desc] = 'NA';
							//console.log('FAILED Pre-check on ' + check.name + ' - ' + check.desc);
							results[check.desc] = 'NA';
							return;
						}

						//i risultati di prec con rep instr son tipo {1:true,2:false,3:true} ... da verificare
					} else if (typeof precPass === 'object' && precPass !== null) {
						//console.log('The precResult is an object.');
						let total = Object.keys(precPass).length * 1000

						//tiene solo gli elementi false, li conta, e restituisce il numero * 1000
						precErrored = Object.values(precPass).filter(value => value === false).length * 1000;

						//console.log("nr of precErrors = " + precErrored);
						//console.log("nr of total = " + total);

						if (precErrored == 0) {
							results[check.desc] = '';
						}
						else {
							results[check.desc] = '' + precErrored;
							if (total == precErrored) {
								//console.log('FAILED ALL Pre-checks on ' + check.name + ' - ' + check.desc);
								results[check.desc] = 'NA';
								return;
							}
						}
					}


					//se ci sono stati problemi in esecuzione prec
					if (!precPass) {
						//					results[check.name + ' - ' + check.desc] = 'NA';
						console.log('FAILED Pre-check on ' + check.name + ' - ' + check.desc);
						results[check.desc] = 'NA';
						return;
					}

				}
				else {
					//console.log("no precheck");
				}





				// Evaluate the check
				const result = check.func(data, ...check.params);

				// Store 'PASS' or 'FAIL' based on the result
				//			results[check.name + ' - ' + check.desc] = result ? 'PASS' : 'FAIL';

				if (typeof result === 'boolean') {
					//console.log('The result is a boolean.');
					let resVal = results[check.name + ' - ' + check.desc];
					if (!result) {
						results[check.name + ' - ' + check.desc] = resVal + 1;
					}
					//				results[check.name + ' - ' + check.desc] = result ? '' : '1';
				} else if (typeof result === 'object' && result !== null) {
					//console.log('The result is an object.');
					const errored = Object.values(result).filter(value => value === false).length;
					//console.log("nr of errors = " + errored);
					if (errored == 0) {
						//results[check.name + ' - ' + check.desc] = '';
					}
					else {
						let resVal = results[check.name + ' - ' + check.desc];
						results[check.name + ' - ' + check.desc] = resVal + errored;
					}
				}

			}
*/
		}

	});
//	allResults[0] = results;
//	allResults[1] = missings;
//
//	return allResults;
	return results;
};
