import { useState } from "react";
import { Eye, EyeOff, XCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner";
import { DoDataQuality } from "@/DoDataQuality";
import { DoAnonymizedData } from "@/DoAnonymizedData";
import { DownloadDataQuality } from "@/DownloadDataQuality";
import { DownloadAnonymizedData } from "@/DownloadAnonymizedData";
import ShareModal from "@/ShareModal";
import { ListOfCenters, CurrentAnalysis, availableQuality, availableAnonymous } from "@/ManageCenters";
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


  // Window size
  /*
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
  */

  
  // List of centers, but arranged in alphabetical order.
  const sortedCenters = [...ListOfCenters].sort((a, b) => a.name.localeCompare(b.name));


  // Selected center changed
  const handleCenterChange = (centerId: string) => {
    const center = ListOfCenters.find(center => (center.id === centerId));
    if (!center) {
      setSelectedCenter(null);
    }
    else {
      setSelectedCenter(center);
    }
    // I reset token and results.
    setToken("");
    setCohortResults(null);
    setAllRecordDataResults(null);
    setResultQuality(null);
    setResultAnonymous(null);
  };


  // Entered token modified
  const handleTokenChange = (value: string) => {
    setToken(value);
    // Cache invalid: the new token could correspond to different permissions/Data.
    setCohortResults(null);
    setAllRecordDataResults(null);
    setResultQuality(null);
    setResultAnonymous(null);
  };


  // -------------
  // ---- RUN ----
  // -------------
  const handleRun = async ({ isAnonymous }: { isAnonymous: boolean }) => {
    // Check the available of functionalities.
    if (!isAnonymous && !availableQuality) {
      console.log("This functionality is not available at the moment.");
      toast.warning("This functionality is not available at the moment.");
      return;
    }
    if (isAnonymous && !availableAnonymous) {
      console.log("This functionality is not available at the moment.");
      toast.warning("This functionality is not available at the moment.");
      return;
    }

    // Check if there are missing input.
    if (!selectedCenter || !token) {
      console.log("Select a center and insert the token.");
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

      // Check if I have already uploaded cohort and allRecordData.
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
        // API calls to get Data.
          // Metadata
        let metadataAPI = await getMetadata(selectedCenter.url, token);
          // Instrument vs Event
        let instrumentsVsEventsAPI = await getInstrVsEvents(selectedCenter.url, token);
          // Repeatings
        let repeatingInstrumentsAndEventsAPI = await getRepeatings(selectedCenter.url, token);
        // I verify that none of the required values are null.
        if (metadataAPI === null || instrumentsVsEventsAPI === null || repeatingInstrumentsAndEventsAPI === null) {
          throw new Error("Failed to fetch information for Data Quality.");
        }
        // If none of the values ​​are null, I save them.
        setMetadata(metadataAPI);
        setInstrumentsVsEvents(instrumentsVsEventsAPI);
        setRepeatingInstrumentsAndEvents(repeatingInstrumentsAndEventsAPI);
        // Start DQ cycles.
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
      toast.success(isAnonymous ? "Anonymization completed!" : "Data Quality completed!");
    }
    
    catch (err: any) {
      console.error(err.message || "Error during the operation.");
      toast.error(err.message || "Error during the operation.");
    }
    
    finally {
      setLoading(false);
    }
  };
  // -------------
  // ---- End ----
  // -------------


  // Download (Data Quality or Anonymous Data)
  const downloadResult = async ({ isAnonymous }: { isAnonymous: boolean }) => {
    if (!selectedCenter) {
      console.error("Error during the download.");
      toast.error("Error during the download.");
      return;
    }

    setLoading(true);

    try {
      // Download implementation
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


  // Result sharing (Data Quality o Anonymous Data)
  const shareResult = ({ isAnonymous }: { isAnonymous: boolean }) => {
    const result = isAnonymous ? resultAnonymous : resultQuality;
    if (!result) return;

    // Sharing implementation
    if (!isAnonymous) {
      setShowShareQuality(true);
    }
    else {
      setShowShareAnonymous(true);
    }
  }


  // TO VERIFY: absence of duplicates
  const hasDuplicatesNames = new Set(ListOfCenters.map(center => center.name)).size != ListOfCenters.length
  const hasDuplicatesIds = new Set(ListOfCenters.map(center => center.id)).size != ListOfCenters.length
  if (hasDuplicatesNames || hasDuplicatesIds) {
    console.log("Duplicates Names: ", hasDuplicatesNames);
    console.log("Duplicates Ids: ", hasDuplicatesIds);
    return (
      <div className="errorMessage">
        Serious error: two hospitals with same name or same ID are present.<br/>
        Please contact an administrator to resolve the issue.
      </div>
    )
  }


  return (
    <div className="container">

      {/* Title */}
      <div className="DQ_Title">
        <h1>EURACAN EHE Data Quality Tool</h1>
      </div>

      {/* Center and Token */}
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

      {/* Buttons */}
      <div className="raw">
        <div className="partofRaw">
          <button
            id="runDQ"
            className="manageButton"
            onClick={() => {
              setResultQuality(null);
              handleRun({ isAnonymous: false })
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
              handleRun({ isAnonymous: true })
            }}
            disabled={loading}
          >
            Anonymous Data Share
          </button>
        </div>
      </div>

      {/* Success */}
      <div className="raw">
        <div className="partofRaw">
          {/* NO Anonymous */}
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
                {/*
                {!dimMobile && <span>✅</span>}
                &nbsp;<u>QUALITY</u>&nbsp;
                {!dimMobile && <span>✅</span>}
                */}
              </div>
              {
                (selectedCenter!==null && cohortResults!==null && allRecordDataResults!==null) &&
                <div>
                  <ul className="infoResults">
                    <li className="scrollText"><b>Center name: </b>{selectedCenter.name}</li>
                    <li className="scrollText"><b>Current Analysis: </b> {CurrentAnalysis}</li>
                    <li className="scrollText"><b>Cohort size: </b> {cohortResults.length}</li>
                  </ul>
                  <button
                    id="downloadResults"
                    onClick={() => downloadResult({ isAnonymous: false })}
                    className="manageButton"
                    disabled={loading}
                  >
                    Download Quality Report
                  </button>
                  <button
                    id="shareResults"
                    onClick={() => shareResult({ isAnonymous: false })}
                    className="manageButton"
                    disabled={loading}
                  >
                    Share Quality Report
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
                      Error during Data loading.<br/>Please contact an administrator.
                    </b> 
                  </li>
                </ul>
              }
            </div>
          )}
        </div>
        <div className="partofRaw">
          {/* YES Anonymous */}
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
                {/*
                {!dimMobile && <span>✅</span>}
                &nbsp;<u>ANONYMOUS</u>&nbsp;
                {!dimMobile && <span>✅</span>}
                */}
              </div>
              {
                (selectedCenter!==null && cohortResults!==null && allRecordDataResults!==null) &&
                <div>
                  <ul className="infoResults">
                    <li className="scrollText"><b>Center name: </b>{selectedCenter.name}</li>
                    <li className="scrollText"><b>Current Analysis: </b> {CurrentAnalysis}</li>
                    <li className="scrollText"><b>Cohort size: </b> {cohortResults.length}</li>
                  </ul>
                  <button
                    id="downloadResults"
                    onClick={() => downloadResult({ isAnonymous: true })}
                    className="manageButton"
                    disabled={loading}
                  >
                    Download Anonymous Data
                  </button>
                  <button
                    id="shareResults"
                    onClick={() => shareResult({ isAnonymous: true })}
                    className="manageButton"
                    disabled={loading}
                  >
                    Share Anonymous Data
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
                      Error during Data loading.<br/>Please contact an administrator.
                    </b> 
                  </li>
                </ul>
              }
            </div>
          )}
        </div>
      </div>

      {/* LOADING */}
      {/* sr-only = screen-reader accessibility */}
      <div role="status" className="sr-only">
        {loading ? "Caricamento in corso..." : ""}
      </div>
      {loading && (
        <div className="loading-overlay" aria-hidden="true">
          <div className="spinner" />
        </div>
      )}
    </div>
  );
}
