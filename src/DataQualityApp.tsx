import { useState, useEffect } from "react";
import { Eye, EyeOff, XCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner";
import { DoAnonymizedData } from "@/DoAnonymizedData";
import ShareModal from "@/ShareModal";
import { ListOfCenters, CurrentAnalysis } from "@/ManageCenters";
import { ManageCohort } from "@/ManageCohort";
import type { REDCapRecord } from "@/utils/types";


export default function DataQualityApp() {
  const [selectedCenter, setSelectedCenter] = useState("");
  const [token, setToken] = useState("");
  const [showToken, setShowToken] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cohortResults, setCohortResults] = useState<string[] | null>(null);
  const [recordDataResults, setRecordDataResults] = useState<REDCapRecord[][] | null>(null);

  const [resultQuality, setResultQuality] = useState<any>(null);
  const [resultAnonymous, setResultAnonymous] = useState<any>(null);
  const [showShareQuality, setShowShareQuality] = useState(false);
  const [showShareAnonymous, setShowShareAnonymous] = useState(false);


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
  const handleCenterChange = (name: string) => {
    setSelectedCenter(name)
    // Resetto token e risultati
    setToken("");
    setResultQuality(null);
    setResultAnonymous(null);
    setCohortResults(null);
    setRecordDataResults(null);
  };


  // ---- RUN ----
  const handleRun = async (centerName: string | undefined, isAnonymous: boolean) => {
    if (!selectedCenter || !token) {
      toast.error("Select a center and insert the token.");
      return;
    }

    setLoading(true);

    try {
      const center = ListOfCenters.find((c) => c.name === centerName);
      if (!center) {
        throw new Error("Problems finding the center.");
      }

      let cohort: string[] | null;
      let recordData: REDCapRecord[][] | null;

      // Verifico se ho già caricato cohort e recordData
      if (cohortResults !== null && recordDataResults !== null) {
        cohort = cohortResults;
        recordData = recordDataResults;
      } else {
        const { cohort: cohortFetched, recordData: recordDataFetched } = await ManageCohort(center, token, CurrentAnalysis);
        setCohortResults(cohortFetched);
        setRecordDataResults(recordDataFetched);
        cohort = cohortFetched;
        recordData = recordDataFetched;
      }
      
      if ((cohort === null) || (recordData === null)) {
        throw new Error("Failed to fetch data.");
      }

      // -- BRANCH --

      if (!isAnonymous) {
        // -- Data Quality --
        // const dqResults = dataQuality(recordData); // funzione ancora da scrivere/collegare
        setResultQuality({
          centerName: center.name,
          extractionDate: new Date().toLocaleString("it-IT"),
          // ... altri campi, costruiti da dqResults
          anonymous: false,
        });

      } else {
        // -- Anonymous Data --
        const anonResults = await DoAnonymizedData(recordData);
        if (anonResults === null) {
          throw new Error("Failed during anonymization.");
        }
        setResultAnonymous({
          centerName: center.name,
          extractionDate: new Date().toLocaleString("it-IT"),
          // ... altri campi, costruiti da anonResults
          anonymous: true,
        });
      }

      toast.success(isAnonymous ? "Anonimizzazione completata!" : "Data Quality completata!");

    } catch (err: any) {
      console.error(err.message || "Error during the operation.");
      toast.error(err.message || "Error during the operation.");

    } finally {
      setLoading(false);
    }
  };


  // Scaricamento dei risultati (Data Quality o Anonymous Data)
  const downloadResult = (isAnonymous: boolean) => {
    const result = isAnonymous ? resultAnonymous : resultQuality;
    if (!result) return;
    // Creazione del Blob (Binary Large Object)
    const blob = new Blob([JSON.stringify(result, null, 2)], {
      type: "application/json",
    });
    const urlBlob = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = urlBlob;
    if (isAnonymous) {
      a.download = `dq-result-anonymous-${selectedCenter}.json`;
    } else {
      a.download = `dq-result-quality-${selectedCenter}.json`;
    }
    a.click();
    URL.revokeObjectURL(urlBlob);
  };

  // Condivisione dei risultati (Data Quality o Anonymous Data)
  const shareResult = (isAnonymous: boolean) => {
    const result = isAnonymous ? resultAnonymous : resultQuality;
    if (!result) return;
    // Implementazione della condivisione
    if (isAnonymous) {
      setShowShareAnonymous(true);
    } else {
      setShowShareQuality(true);
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
            value={selectedCenter}
            onValueChange={handleCenterChange}
            disabled={loading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select center" />
            </SelectTrigger>
            <SelectContent side="bottom" align="start">
              <SelectItem key="" value="">
                - Select center -
              </SelectItem>
              {sortedCenters.map((c) => (
                <SelectItem key={c.name} value={c.name}>
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
              onChange={(e) => setToken(e.target.value)}
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
              handleRun(selectedCenter, false)
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
              handleRun(selectedCenter, true)
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
              >
                <XCircle size={24}/>
              </button>
              <div className="titleResults">
                {!dimMobile && <span>✅</span>}
                &nbsp;<u>QUALITY</u>&nbsp;
                {!dimMobile && <span>✅</span>}
              </div>
              {
                (cohortResults !== null && recordDataResults !== null) &&
                <div>
                  <ul className="infoResults">
                    <li className="scrollText"><b>Center:</b> {resultQuality.centerName}</li>
                    <li className="scrollText"><b>Extraction Date:</b> {resultQuality.extractionDate}</li>
                    <li className="scrollText"><b>Name: </b> {CurrentAnalysis} - {selectedCenter}</li>
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
                      key={`${resultQuality.centerName}-${resultQuality.extractionDate}`}
                      centerName={resultQuality.centerName}
                      title="quality"
                      onClose={() => setShowShareQuality(false)} />
                  )}
                </div>
              }
              {
                (cohortResults === null || recordDataResults === null) &&
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
              >
                <XCircle size={24}/>
              </button>
              <div className="titleResults">
                {!dimMobile && <span>✅</span>}
                &nbsp;<u>ANONYMOUS</u>&nbsp;
                {!dimMobile && <span>✅</span>}
              </div>
              {
                (cohortResults !== null && recordDataResults !== null) &&
                <div>
                  <ul className="infoResults">
                    <li className="scrollText"><b>Center:</b> {resultAnonymous.centerName}</li>
                    <li className="scrollText"><b>Extraction Date:</b> {resultAnonymous.extractionDate}</li>
                    <li className="scrollText"><b>Name: </b> {CurrentAnalysis} - {selectedCenter}</li>
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
                      key={`${resultAnonymous.centerName}-${resultAnonymous.extractionDate}`}
                      centerName={resultAnonymous.centerName}
                      title="anonymous"
                      onClose={() => setShowShareAnonymous(false)} />
                  )}
                </div>
              }
              {
                (cohortResults === null || recordDataResults === null) &&
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
