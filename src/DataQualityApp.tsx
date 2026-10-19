import { useState, useEffect } from "react";
import { Eye, EyeOff, XCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner";
import { DoDataQuality } from "@/DoDataQuality";
import { DoAnonymizedData } from "@/DoAnonymizedData";
import { DownloadDataQuality } from "@/DownloadDataQuality";
import { DownloadAnonymizedData } from "@/DownloadAnonymizedData";
import ShareModal from "@/ShareModal";
import { ListOfCenters, CurrentAnalysis } from "@/ManageCenters";
import { ManageCohort } from "@/ManageCohort";
import { getMetadata, getInstrVsEvents, getRepeatings } from "@/fetch/dq-fetch";
import type { Center, REDCapRecord, DQRecord, REDCapMetadataField, REDCapInstrVsEventsField, REDCapRepeatingsField } from "@/utils/types";


export default function DataQualityApp() {
  const [selectedCenter, setSelectedCenter] = useState<Center | null>(null);
  const [token, setToken] = useState("");
  const [showToken, setShowToken] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cohortResults, setCohortResults] = useState<string[] | null>(null);
  const [allRecordDataResults, setAllRecordDataResults] = useState<REDCapRecord[][] | null>(null);
  const [resultQuality, setResultQuality] = useState<Record<string, DQRecord> | null>(null);
  const [resultAnonymous, setResultAnonymous] = useState<REDCapRecord[][] | null>(null);
  const [showShareQuality, setShowShareQuality] = useState(false);
  const [showShareAnonymous, setShowShareAnonymous] = useState(false);
  const [metadata, setMetadata] = useState<REDCapMetadataField[]>([]);
  const [instrumentsVsEvents, setInstrumentsVsEvents] = useState<REDCapInstrVsEventsField[]>([]);
  const [repeatingInstrumentsAndEvents, setRepeatingInstrumentsAndEvents] = useState<REDCapRepeatingsField[]>([]);


  // Dimensioni finestra
  const [dimMobile, setDimMobile] = useState(window.innerWidth < 1024);
  useEffect(() => {
    const handleResize = () => {
      setDimMobile(window.innerWidth < 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Insieme dei centri, ma ordinato in ordine alfabetico
  const sortedCenters = [...ListOfCenters].sort((a, b) => a.name.localeCompare(b.name));

  // Cambio il centro selezionato
  const handleCenterChange = (centerId: string) => {
    const center = ListOfCenters.find(center => (center.id === centerId));
    if (!center) {
      setSelectedCenter(null);
    }
    else {
      setSelectedCenter(center);
    }
    // Resetto token e risultati
    setToken("");
    setCohortResults(null);
    setAllRecordDataResults(null);
    setResultQuality(null);
    setResultAnonymous(null);
  };

  // Modifico il token scritto
  const handleTokenChange = (value: string) => {
    setToken(value);
    // Invalido la cache: il nuovo token potrebbe corrispondere a permessi/dati diversi
    setCohortResults(null);
    setAllRecordDataResults(null);
    setResultQuality(null);
    setResultAnonymous(null);
  };


  // -------------
  // ---- RUN ----
  // -------------
  const handleRun = async (isAnonymous: boolean) => {
    if (!selectedCenter || !token) {
      toast.error("Select a center and insert the token.");
      return;
    }

    setLoading(true);
    let cohort: string[] | null;
    let allRecordData: REDCapRecord[][] | null;

    try {
      const center = ListOfCenters.find((c) => c.id === selectedCenter.id);
      if (!center) {
        throw new Error("Problems finding the center.");
      }

      // Verifico se ho già caricato cohort e allRecordData
      if (cohortResults !== null && allRecordDataResults !== null) {
        cohort = cohortResults;
        allRecordData = allRecordDataResults;
      }
      else {
        const { cohort: cohortFetched, allRecordData: allRecordDataFetched } = await ManageCohort(center, token, CurrentAnalysis);
        setCohortResults(cohortFetched);
        setAllRecordDataResults(allRecordDataFetched);
        cohort = cohortFetched;
        allRecordData = allRecordDataFetched;
      }
      
      if ((cohort === null) || (allRecordData === null)) {
        throw new Error("Failed to fetch data.");
      }

      console.log("Cohort: ", cohort);
      console.log("AllRecordData: ", allRecordData);

      // ---- BRANCH ----

      if (!isAnonymous) {
        // ---- Data Quality ----
        const qualityResult: Record<string, DQRecord> = {};
        // Chiamate API per ottenere i dati che mi servono
          // Metadata
        let metadataAPI = await getMetadata(selectedCenter.url, token);
          // Instrument vs Event
        let instrumentsVsEventsAPI = await getInstrVsEvents(selectedCenter.url, token);
          // Repeatings
        let repeatingInstrumentsAndEventsAPI = await getRepeatings(selectedCenter.url, token);
        // Verifico che nessuno dei valori necessari sia nullo
        if (metadataAPI === null || instrumentsVsEventsAPI === null || repeatingInstrumentsAndEventsAPI === null) {
          throw new Error("Failed to fetch information for Data Quality.");
        }
        // Se nessuno dei valori è nullo, li salvo
        setMetadata(metadataAPI);
        setInstrumentsVsEvents(instrumentsVsEventsAPI);
        setRepeatingInstrumentsAndEvents(repeatingInstrumentsAndEventsAPI);
        // Inizio cicli DQ
        for (let i = 0; i < cohort.length; i++) {
          let dq = await DoDataQuality(allRecordData[i], metadataAPI, instrumentsVsEventsAPI, repeatingInstrumentsAndEventsAPI);
          if (dq === null) {
            throw new Error("Failed during Data Quality.");
          }
          qualityResult[cohort[i]] = dq;
        }
        setResultQuality(qualityResult);
      }
      
      else {
        // ---- Anonymous Data ----
        const anonymousResult = await DoAnonymizedData(allRecordData);
        if (anonymousResult === null) {
          throw new Error("Failed during Data Anonymization.");
        }
        const anonymousArray: REDCapRecord[][] = Object.values(anonymousResult);
        setResultAnonymous(anonymousArray);
      }

      // -- Completed --
      toast.success(isAnonymous ? "Anonimizzazione completata!" : "Data Quality completata!");

    } catch (err: any) {
      console.error(err.message || "Error during the operation.");
      toast.error(err.message || "Error during the operation.");

    } finally {
      setLoading(false);
    }
  };
  // -------------
  // ---- End ----
  // -------------


  // Scaricamento (Data Quality o Anonymous Data)
  const downloadResult = async (isAnonymous: boolean) => {
    if (!selectedCenter) {
      console.error("Error during the download.");
      toast.error("Error during the download.");
      return;
    }

    setLoading(true);

    try {
      // Implementazione del download
      if (!isAnonymous && resultQuality !== null) {
        // ---- Data Quality ----
        if (allRecordDataResults === null) {
          console.error("The list of Record Data is null.");
          toast.error("The list of Record Data is null.");
        }
        else if (cohortResults === null) {
          console.error("The Cohort is null.");
          toast.error("The Cohort is null.");
        }
        else {
          await DownloadDataQuality(selectedCenter, token, allRecordDataResults, cohortResults, metadata, instrumentsVsEvents, repeatingInstrumentsAndEvents, CurrentAnalysis, resultQuality);
        }
      }
      else if (isAnonymous && resultAnonymous !== null) {
        // ---- Anonymous Data ----
        await DownloadAnonymizedData(selectedCenter, CurrentAnalysis, resultAnonymous);
      }
      else {
        console.error("Error during the download.");
        toast.error("Error during the download.");
      }
    }
    finally {
      setLoading(false);
    }
  }


  // Condivisione dei risultati (Data Quality o Anonymous Data)
  const shareResult = (isAnonymous: boolean) => {
    const result = isAnonymous ? resultAnonymous : resultQuality;
    if (!result) return;

    // Implementazione della condivisione
    if (!isAnonymous) {
      setShowShareQuality(true);
    }
    else {
      setShowShareAnonymous(true);
    }
  }


  // VERIFICA: assenza di duplicati
  const hasDuplicatesNames = new Set(ListOfCenters.map(center => center.name)).size != ListOfCenters.length
  const hasDuplicatesIds = new Set(ListOfCenters.map(center => center.id)).size != ListOfCenters.length
  if (hasDuplicatesNames || hasDuplicatesIds) {
    console.log("Duplicates Names: ", hasDuplicatesNames);
    console.log("Duplicates Ids: ", hasDuplicatesIds);
    return (
      <div className="errorMessage">
        Errore grave: presenti due ospedali con lo stesso nome o lo stesso id.<br/>
        Contattare un amministratore per risolvere il problema.
      </div>
    )
  }


  return (
    <div className="container">

      {/* Titolo */}
      <div className="DQ_Title">
        <h1>Data Quality Tool</h1>
      </div>

      {/* Centro e Token */}
      <div className="raw">
        <div className="partofRaw">
          <Select
            value={selectedCenter?.id ?? "empty"}
            onValueChange={handleCenterChange}
            disabled={loading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select center" />
            </SelectTrigger>
            <SelectContent side="bottom" align="start">
              <SelectItem key="empty" value="empty">
                - Select center -
              </SelectItem>
              {sortedCenters.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="partofRaw">
          <div className="tokenInput">
            <input
              id="token"
              type={showToken ? "text" : "password"}
              value={token}
              placeholder="Insert token"
              disabled={loading}
              onChange={(e) => handleTokenChange(e.target.value)}
            />
            <button
              type="button"
              className="eye mr-[8px]"
              disabled={loading}
              onClick={() => setShowToken((v) => !v)}
            >
              {showToken && <Eye size={20}/>}
              {!showToken && <EyeOff size={20}/>}
            </button>
          </div>
        </div>
      </div>

      {/* Bottoni */}
      <div className="raw">
        <div className="partofRaw">
          <button
            id="runDQ"
            className="manageButton"
            onClick={() => {
              setResultQuality(null);
              handleRun(false)
            }}
            disabled={loading}
          >
            Data Quality
          </button>
        </div>
        <div className="partofRaw">
          <button
            id="runDQ_anonymous"
            className="manageButton"
            onClick={() => {
              setResultAnonymous(null);
              handleRun(true)
            }}
            disabled={loading}
          >
            Anonymous Data
          </button>
        </div>
      </div>

      {/* Successo */}
      <div className="raw">
        <div className="partofRaw">
          {/* Non anonimi */}
          {resultQuality && (
            <div className="containerResults">
              <button
                onClick={() => setResultQuality(null)}
                className="buttonX"
                disabled={loading}
              >
                <XCircle size={24}/>
              </button>
              <div className="titleResults">
                {!dimMobile && <span>✅</span>}
                &nbsp;<u>QUALITY</u>&nbsp;
                {!dimMobile && <span>✅</span>}
              </div>
              {
                (selectedCenter!==null && cohortResults!==null && allRecordDataResults!==null) &&
                <div>
                  <ul className="infoResults">
                    <li className="scrollText"><b>Name: </b> {CurrentAnalysis} - {selectedCenter.name}</li>
                    <li className="scrollText"><b>Cohort: </b> {cohortResults.join(", ")}</li>
                  </ul>
                  <button
                    id="downloadResults"
                    onClick={() => downloadResult(false)}
                    className="manageButton"
                    disabled={loading}
                  >
                    Download Quality
                  </button>
                  <button
                    id="shareResults"
                    onClick={() => shareResult(false)}
                    className="manageButton"
                    disabled={loading}
                  >
                    Share Quality
                  </button>
                  {showShareQuality && (
                    <ShareModal
                      key={`${selectedCenter.id}`}
                      center={selectedCenter}
                      title="quality"
                      result={resultQuality}
                      onClose={() => setShowShareQuality(false)}
                      token={token}
                      metadata={metadata}
                      instrumentsVsEvents={instrumentsVsEvents}
                      repeatings={repeatingInstrumentsAndEvents}
                      allRecordData={allRecordDataResults}
                      cohort={cohortResults}
                    />
                  )}
                </div>
              }
              {
                (selectedCenter === null || cohortResults === null || allRecordDataResults === null) &&
                <ul className="infoResults">
                  <li className="scrollText">
                    <b>
                      Errore nel caricamento dei dati.<br/>Contatta un amministratore.
                    </b> 
                  </li>
                </ul>
              }
            </div>
          )}
        </div>
        <div className="partofRaw">
          {/* Anonimizzati */}
          {resultAnonymous && (
            <div className="containerResults">
              <button
                onClick={() => setResultAnonymous(null)}
                className="buttonX"
                disabled={loading}
              >
                <XCircle size={24}/>
              </button>
              <div className="titleResults">
                {!dimMobile && <span>✅</span>}
                &nbsp;<u>ANONYMOUS</u>&nbsp;
                {!dimMobile && <span>✅</span>}
              </div>
              {
                (selectedCenter!==null && cohortResults!==null && allRecordDataResults!==null) &&
                <div>
                  <ul className="infoResults">
                    <li className="scrollText"><b>Name: </b> {CurrentAnalysis} - {selectedCenter.name}</li>
                    <li className="scrollText"><b>Cohort: </b> {cohortResults.join(", ")}</li>
                  </ul>
                  <button
                    id="downloadResults"
                    onClick={() => downloadResult(true)}
                    className="manageButton"
                    disabled={loading}
                  >
                    Download Anonymous
                  </button>
                  <button
                    id="shareResults"
                    onClick={() => shareResult(true)}
                    className="manageButton"
                    disabled={loading}
                  >
                    Share Anonymous
                  </button>
                  {showShareAnonymous && (
                    <ShareModal
                      key={`${selectedCenter.id}`}
                      center={selectedCenter}
                      title="anonymous"
                      result={resultAnonymous}
                      onClose={() => setShowShareAnonymous(false)}
                    />
                  )}
                </div>
              }
              {
                (selectedCenter === null || cohortResults === null || allRecordDataResults === null) &&
                <ul className="infoResults">
                  <li className="scrollText">
                    <b>
                      Errore nel caricamento dei dati.<br/>Contatta un amministratore.
                    </b> 
                  </li>
                </ul>
              }
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
