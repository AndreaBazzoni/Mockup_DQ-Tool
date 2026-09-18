import { useState, useEffect } from "react";
import { Eye, EyeOff, XCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner";
import ShareModal from "@/ShareModal";
import { ListOfCenters } from "@/ListOfCenters";
import { fetchFileRepository, fetchCohort, createCohort, getCohort } from "@/fetch/redcap-fetch"
import { createTxtFile } from "@/utils/createFile";


export default function DataQualityApp() {
  const [selectedCenter, setSelectedCenter] = useState("");
  const [token, setToken] = useState("");
  const [showToken, setShowToken] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultQuality, setResultQuality] = useState<any>(null);
  const [resultAnonymous, setResultAnonymous] = useState<any>(null);
  const [showShareQuality, setShowShareQuality] = useState(false);
  const [showShareAnonymous, setShowShareAnonymous] = useState(false);
  const [cohort, setCohort] = useState<String[]>([]);

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
  };

  // Run (Data Quality or Anonymous Data)
  const handleRun = async (name: string | undefined, isAnonymous: boolean) => {
    // Dati mancanti
    if (!selectedCenter || !token) {
      toast.error("Select a center and insert the token");
      return;
    }
    setLoading(true);
    try {
      const center = ListOfCenters.find((c) => c.name === name);
      // Centro non trovato
      if (!center) {
        throw new Error("Problems finding the center");
      }
      // Chiamata API
      const fileList = await fetchFileRepository(center.id, token)
      const cohortFile = fileList.find((file: any) => file.name === `coorte-${center.id}.txt`)
      if (cohortFile) {
        // Se è presente la coorte, la estrapolo
        setCohort(await getCohort(center.id, token, cohortFile.doc_id));
        console.log(`Coorte dell'ospedale "${center.name}": `, cohort);
        // Creazione dei risultati
        const result = {
          centerName: center.name,
          extractionDate: new Date().toLocaleString("it-IT"),
          totalPatients: 100,
          spanTime: "01/01/2023 - 31/12/2023",
          missingData: 5,
          errors: ["No errors found"],
          anonymous: isAnonymous
        };
        // Distinguo tra Quality e Anonymous
        if (isAnonymous) {
          setResultAnonymous(result);
        } else {
          setResultQuality(result);
        }
      } else {
        // Se non è presente la coorte, la creo e la utilizzo
        setCohort(await fetchCohort(center.id, token));
        const cohortIds = cohort.map((patient: any) => patient.record_id);
        const cohortTxtFile = createTxtFile(cohortIds, `coorte-${center.id}.txt`);
        await createCohort(center.id, token, cohortTxtFile);
        console.log(`Coorte creata per l'ospedale "${center.name}"`);
        toast.success("Coorte creata con successo!");
      }
    } catch(err: any) {
      toast.error(err.message || "Error during the operation");
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
  const hasDuplicates = new Set(ListOfCenters.map(center => center.name)).size != ListOfCenters.length
  if (hasDuplicates) {
    return (
      <div className="errorMessage">
        Errore grave: presenti due ospedali con lo stesso nome.<br/>
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
            onClick={() => handleRun(selectedCenter, false)}
            disabled={loading}
          >
            Data Quality
          </button>
        </div>
        <div className="partofRaw">
          <button
            id="runDQ_anonymous"
            className="manageButton"
            onClick={() => handleRun(selectedCenter, true)}
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
              <ul className="infoResults">
                <li className="scrollText"><b>Center:</b> {resultQuality.centerName}</li>
                <li className="scrollText"><b>Extraction Date:</b> {resultQuality.extractionDate}</li>
                <li className="scrollText"><b>Total Patients:</b> {resultQuality.totalPatients}</li>
                <li className="scrollText"><b>Span Time:</b> {resultQuality.spanTime}</li>
                <li className="scrollText"><b>Cohort: </b> {cohort.join(", ")}</li>
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
              <ul className="infoResults">
                <li className="scrollText"><b>Center:</b> {resultAnonymous.centerName}</li>
                <li className="scrollText"><b>Extraction Date:</b> {resultAnonymous.extractionDate}</li>
                <li className="scrollText"><b>Total Patients:</b> {resultAnonymous.totalPatients}</li>
                <li className="scrollText"><b>Span Time:</b> {resultAnonymous.spanTime}</li>
                <li className="scrollText"><b>Cohort: </b> {cohort.join(", ")}</li>
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
          )}
        </div>
      </div>

    </div>
  );
}
