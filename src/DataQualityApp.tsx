import { useState, useEffect } from "react";
import { Eye, EyeOff, Pencil, Trash, XCircle, ChevronDownCircle, ChevronUpCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner";
import ShareModal from "@/ShareModal";


export default function DataQualityApp() {
  // Dichiarazione delle costanti
  const dimMinToken = 8;
  interface centerType {
    name: string,
    url: string,
    token: string
  }
  const [selectedCenter, setSelectedCenter] = useState("");
  const [token, setToken] = useState("");
  const [showToken, setShowToken] = useState(false);
  const [showTokenCreate, setShowTokenCreate] = useState(false);
  const [showTokenNew, setShowTokenNew] = useState(false);
  const [showTokenOld, setShowTokenOld] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [resultAnonymous, setResultAnonymous] = useState<any>(null);
  const [currentCenter, setCurrentCenter] = useState<centerType>();
  const [verifyToken, setVerifyToken] = useState("");
  const [newName, setNewName] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newToken, setNewToken] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
  const [openManage, setOpenManage] = useState(false);
  const [openModify, setOpenModify] = useState(false);
  const [openRemove, setOpenRemove] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  // DA TOGLIERE
  const [visibleModification, setVisibleModification] = useState(false);
  // ------------

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

  // Insieme dei centri
  const [centers, setCenters] = useState<{ name: string; url: string; token: string }[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("centers") || "[]");
    } catch {
      return [];
    }
  });
  useEffect(() => {
    localStorage.setItem("centers", JSON.stringify(centers));
  }, [centers]);

  // Insieme dei centri, ma ordinato in ordine alfabetico
  const sortedCenters = [...centers].sort((a, b) => a.name.localeCompare(b.name));

  // Aggiunge un centro (evita duplicati)
  const addCenter = (name: string, url: string, token: string,) => {
    setCenters((prev) => {
      // Esiste già un centro con tale nome
      if (prev.some((c) => c.name === name)) {
        toast.error("Already exists a center with this name");
        return prev;
      }
      return [...prev, { name, url, token }];
    });
  };

  // Crea un centro
  const createCenter = () => {
    // Campi mancanti
    if (!newName || !newUrl || !newToken) {
      toast.warning("Please fill in all fields");
      return;
    }
    // Esiste già un centro con tale nome
    if (centers.some((c) => c.name === newName)) {
      toast.error("Already exists a center with this name")
      return;
    }
    // Nuovo token non valido
    if (newToken.length < dimMinToken) {
      toast.error(`Invalid token (at least ${dimMinToken} characters)`);
      return;
    }
    setLoading(true)
    addCenter(newName, newUrl, newToken);
    setOpenCreate(false);
    setLoading(false);
    toast.success("Center created successfully!");
  };

  // Modifico un centro
  const modifyCenter = (name: string) => {
    setLoading(true)
    try {
      const center = centers.find((c) => c.name === name);
      // Centro non trovato
      if (!center || !currentCenter) {
        throw new Error("Problems finding the center");
      }
      // Token inserito non corretto
      if (verifyToken!==center.token) {
        throw new Error("Incorrect token");
      }
      // Esiste già un centro con tale nome
      if (centers.some((c) => c.name === newName) && (newName!==currentCenter.name)) {
        throw new Error("Already exists a center with this name");
      }
      // Nuovo token non valido
      if (newToken.length < dimMinToken) {
        throw new Error(`Invalid token (at least ${dimMinToken} characters)`);
      }
      // AZIONE
      setCenters((prev) =>
        prev.map((c) => (c.name === name ? { name: newName, url: newUrl, token: newToken } : c))
      );
      if (selectedCenter === name) {
        setSelectedCenter(newName);
      }
      toast.success("Center modified successfully!");
    } catch (err: any) {
      toast.error(err.message || "Error during the operation");
      return;
    } finally {
      setOpenModify(false);
      setLoading(false);
    }
  };

  // Rimuove un centro
  const removeCenter = (name: string) => {
    setLoading(true);
    try {
      const center = centers.find((c) => c.name === name);
      // Centro non trovato
      if (!center || !currentCenter) {
        throw new Error("Problems finding the center");
      }
      // Token inserito non corretto
      if (verifyToken!==center.token) {
        throw new Error("Incorrect token");
      }
      // AZIONE
      setCenters((prev) => prev.filter((c) => c.name !== currentCenter.name));
      if (selectedCenter === currentCenter.name) {
        setSelectedCenter("");
        setToken("");
      }
      toast.success("Center removed successfully!");
    } catch (err: any) {
      toast.error(err.message || "Error during the operation");
      return;
    } finally {
      setOpenRemove(false);
      setLoading(false);
    }
  };

  // Cambio il centro selezionato
  const handleCenterChange = (name: string) => {
    setSelectedCenter(name);
    const found = centers.find((c) => c.name === name);
    if (found) {
      const fillToken = confirm("Do you want to fill the token automatically?");
      if (fillToken) {
        setToken(found.token);
      } else {
        setToken("");
      }
    } else {
      setToken("");
    }
  };

  // Run DataQuality
  const handleRunDQ = async (name?: string) => {
    setLoading(true);
    try {
      const center = centers.find((c) => c.name === name);
      // Dati mancanti
      if (!selectedCenter || !token) {
        throw new Error("Select a center and insert the token");
      }
      // Simulazione chiamata API
      await new Promise((resolve) => setTimeout(resolve, 1500));
      // Centro non trovato
      if (!center) {
        throw new Error("Problems finding the center");
      }
      // Token inserito non corretto
      if (token!==center.token) {
        throw new Error("Incorrect token");
      }
      // Creazione dei risultati
      const fakeResult = {
        centerName: center.name,
        extractionDate: new Date().toLocaleString("it-IT"),
        totalPatients: 100,
        spanTime: "01/01/2023 - 31/12/2023",
        missingData: 5,
        errors: ["No errors found"],
        anonymous: false
      };
      setResult(fakeResult);
    } catch(err: any) {
      toast.error(err.message || "Error during the operation");
    } finally {
      setLoading(false);
    }
  };

  // Run DataQuality anonymous
  const handleRunDQ_anonymous = async (name?: string) => {
    setLoading(true);
    try {
      const center = centers.find((c) => c.name === name);
      // Dati mancanti
      if (!selectedCenter || !token) {
        throw new Error("Select a center and insert the token");
      }
      // Simulazione chiamata API
      await new Promise((resolve) => setTimeout(resolve, 1500));
      // Centro non trovato
      if (!center) {
        throw new Error("Problems finding the center");
      }
      // Token inserito non corretto
      if (token!==center.token) {
        throw new Error("Incorrect token");
      }
      // Creazione dei risultati
      const fakeResultAnonymous = {
        centerName: center.name,
        extractionDate: new Date().toLocaleString("it-IT"),
        totalPatients: 100,
        spanTime: "01/01/2023 - 31/12/2023",
        missingData: 5,
        errors: ["No errors found"],
        anonymous: true
      };
      setResultAnonymous(fakeResultAnonymous);
    } catch(err: any) {
      toast.error(err.message || "Error during the operation");
    } finally {
      setLoading(false);
    }
  };

  // Scaricamento dei risultati
  const downloadResult = () => {
    if (!result) return;
    // Creazione del Blob (Binary Large Object)
    const blob = new Blob([JSON.stringify(result, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dq-result-${selectedCenter}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Condivisione dei risultati
  function shareResult() {
    if (!result) return;
    // Implementazione della condivisione
    setShowShareModal(true);
  }

  return (
    <div className="container">

      {/* Titolo */}
      <div className="relative">
        <h1>Data Quality Tool</h1>
        {/* DA TOGLIERE */}
        <button
          id="toggleModification"
          type="button"
          disabled={loading}
          onClick={() => setVisibleModification((v) => !v)}
        >
          {visibleModification && <ChevronUpCircle size={20}/>}
          {!visibleModification && <ChevronDownCircle size={20}/>}
        </button>
        {/* ------------ */}
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

      {/* DA TOGLIERE */}
      {visibleModification && (
        <div className="raw">
          <button
            className="partofRaw"
            disabled={loading}
            onClick={() => {
              setNewName("");
              setNewUrl("");
              setNewToken("");
              setVerifyToken("");
              setShowTokenCreate(false);
              setOpenCreate(true)
            }}
          >
            Create center
          </button>
          <button
            className="partofRaw"
            disabled={loading}
            onClick={() => {
              setNewName("");
              setNewUrl("");
              setNewToken("");
              setVerifyToken("");
              setShowTokenCreate(false);
              setShowTokenNew(false);
              setShowTokenOld(false);
              setOpenManage(true);
            }}
          >
            Manage centers
          </button>
        </div>
      )}
      {/* ------------ */}

      {/* Bottone DQ */}
      <div className="raw">
        <div className="partofRaw">
          <button
            id="runDQ"
            className="manageButton"
            onClick={() => handleRunDQ(selectedCenter)}
            disabled={loading}
          >
            Run Data Quality
          </button>
        </div>
        <div className="partofRaw">
          <button
            id="runDQ_anonymous"
            className="manageButton"
            onClick={() => handleRunDQ_anonymous(selectedCenter)}
            disabled={loading}
          >
            Anonymous Data Sharing
          </button>
        </div>
      </div>

      {/* Successo */}
      <div className="raw">
        <div className="partofRaw">
          {/* Non anonimi */}
          {result && (
            <div className="containerResults">
              <button
                onClick={() => setResult(null)}
                className="buttonX"
              >
                <XCircle size={24}/>
              </button>
              <div className="titleResults">
                {!dimMobile && <span>✅</span>}
                &nbsp;<u>COMPLETE</u>&nbsp;
                {!dimMobile && <span>✅</span>}
              </div>
              <ul className="infoResults">
                <li className="scrollText"><b>Center:</b> {result.centerName}</li>
                <li className="scrollText"><b>Extraction Date:</b> {result.extractionDate}</li>
                <li className="scrollText"><b>Total Patients:</b> {result.totalPatients}</li>
                <li className="scrollText"><b>Span Time:</b> {result.spanTime}</li>
              </ul>
              <button
                id="downloadResults"
                onClick={downloadResult}
                className="manageButton"
                disabled={loading}
              >
                Download Results
              </button>
              <button
                id="shareResults"
                onClick={shareResult}
                className="manageButton"
                disabled={loading}
              >
                Share Results
              </button>
              {showShareModal && (
                <ShareModal centerName={result.centerName} title="Share Results" onClose={() => setShowShareModal(false)} />
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
                &nbsp;<u>READY to SHARE</u>&nbsp;
                {!dimMobile && <span>✅</span>}
              </div>
              <ul className="infoResults">
                <li className="scrollText"><b>Center:</b> {resultAnonymous.centerName}</li>
                <li className="scrollText"><b>Extraction Date:</b> {resultAnonymous.extractionDate}</li>
                <li className="scrollText"><b>Total Patients:</b> {resultAnonymous.totalPatients}</li>
                <li className="scrollText"><b>Span Time:</b> {resultAnonymous.spanTime}</li>
              </ul>
              <button
                id="downloadResults"
                onClick={downloadResult}
                className="manageButton"
                disabled={loading}
              >
                Download Anonymous
              </button>
              <button
                id="shareResults"
                onClick={shareResult}
                className="manageButton"
                disabled={loading}
              >
                Share Anonymous
              </button>
              {showShareModal && (
                <ShareModal centerName={result.centerName} title="Share Anonymous" onClose={() => setShowShareModal(false)} />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Dialog di Creazione centro */}
      <Dialog
        open={openCreate}
        onOpenChange={(open) => {
          setOpenCreate(open);
        }}
      >
        <DialogContent
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>
              <div>
                <b><u>Create center</u></b>
              </div>
            </DialogTitle>
          </DialogHeader>
          <div className="dialogBody">
            <input
              placeholder="Name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <input
              placeholder="URL website"
              type="url"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
            />
            <div className="tokenInput">
              <input
                type={showTokenCreate ? "text" : "password"}
                placeholder="Token"
                value={newToken}
                onChange={(e) => setNewToken(e.target.value)}
              />
              <button
                type="button"
                className="eye"
                onClick={() => setShowTokenCreate((v) => !v)}
              >
                {showTokenCreate && <Eye size={20}/>}
                {!showTokenCreate && <EyeOff size={20}/>}
              </button>
            </div>
          </div>
          <DialogFooter>
            <button
              onClick={() => {
                setOpenCreate(false);
              }}
            >
              Cancel
            </button>
            <button
              className="manageButton"
              onClick={() => createCenter()}
            >
              Create
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog di Gestione centro */}
      <Dialog
        open={openManage}
        onOpenChange={(open) => {
          setOpenManage(open);
        }}
      >
        <DialogContent
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>
              <div>
                <b><u>Manage centers</u></b>
              </div>
            </DialogTitle>
          </DialogHeader>
          <div className="dialogBody">
            {centers.length === 0 && <p>No centers configured.</p>}
            {sortedCenters.map((c) => (
              <div key={c.name} className="flex flex-row justify-between">
                <div className="infoCenter">
                  <p className="text-[16px]">{c.name}</p>
                  <p className="text-[12px]"><i>{c.url}</i></p>
                </div>
                <div className="buttonZone">
                  <button
                    onClick={() => {
                      setNewToken("");
                      setVerifyToken("");
                      setShowTokenCreate(false);
                      setShowTokenNew(false);
                      setShowTokenOld(false);
                      setCurrentCenter(c);
                      setNewName(c.name);
                      setNewUrl(c.url);
                      setOpenModify(true);
                    }}
                    className="manageButton"
                  >
                    <Pencil />
                  </button>
                  <button
                    onClick={() => {
                      setNewToken("");
                      setVerifyToken("");
                      setShowTokenNew(false);
                      setShowTokenOld(false);
                      setCurrentCenter(c);
                      setNewName(c.name);
                      setNewUrl(c.url);
                      setOpenRemove(true);
                    }}
                    className="manageButton"
                  >
                    <Trash />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <DialogFooter>
            <button
              onClick={() => setOpenManage(false)}
            >
              Close
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog di Modifica centro */}
      {currentCenter && (
        <Dialog 
          open={openModify}
          onOpenChange={(open) => {
            setNewName("");
            setNewUrl("");
            setNewToken("");
            setVerifyToken("");
            setOpenModify(open);
          }}
        >
          <DialogContent
            onPointerDownOutside={(e) => e.preventDefault()}
            onInteractOutside={(e) => e.preventDefault()}
          >
            <DialogHeader>
              <DialogTitle>
                <div>
                  <b><u>Modify Center</u></b>
                </div>
              </DialogTitle>
            </DialogHeader>
            <div className="scrollText">
              <i>{currentCenter.name}</i>
            </div>
            <div className="dialogBody">
              <input
                placeholder="New name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
              <input
                placeholder="New website URL"
                type="url"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
              />
              <div className="tokenInput">
                <input
                  type={showTokenNew ? "text" : "password"}
                  placeholder="New token"
                  value={newToken}
                  onChange={(e) => setNewToken(e.target.value)}
                />
                <button
                  type="button"
                  className="eye"
                  onClick={() => setShowTokenNew((v) => !v)}
                >
                  {showTokenNew && <Eye size={20}/>}
                  {!showTokenNew && <EyeOff size={20}/>}
                </button>
              </div>
              <div className="tokenInput">
                <input
                  type={showTokenOld ? "text" : "password"}
                  placeholder="Old token"
                  value={verifyToken}
                  onChange={(e) => setVerifyToken(e.target.value)}
                />
                <button
                  type="button"
                  className="eye"
                  onClick={() => setShowTokenOld((v) => !v)}
                >
                  {showTokenOld && <Eye size={20}/>}
                  {!showTokenOld && <EyeOff size={20}/>}
                </button>
              </div>
            </div>
            <DialogFooter>
              <button
                onClick={() => setOpenModify(false)}
              >
                Cancel
              </button>
              <button
                className="manageButton"
                onClick={() => modifyCenter(currentCenter.name)}
              >
                Confirm
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Dialog di Rimozione centro */}
      {currentCenter && (
        <Dialog
          open={openRemove}
          onOpenChange={(open) => {
            setNewName("");
            setNewUrl("");
            setNewToken("");
            setVerifyToken("");
            setOpenRemove(open);
          }}
        >
          <DialogContent
            onPointerDownOutside={(e) => e.preventDefault()}
            onInteractOutside={(e) => e.preventDefault()}
          >
            <DialogHeader>
              <DialogTitle>
                <div>
                  <b><u>Remove center</u></b>
                </div>
              </DialogTitle>
            </DialogHeader>
            <div className="scrollText">
              <i>{currentCenter.name}</i>
            </div>
            <p>Enter the token to confirm.</p>
            <div className="tokenInput">
              <input
                type={showTokenOld ? "text" : "password"}
                placeholder="Token"
                value={verifyToken}
                onChange={(e) => setVerifyToken(e.target.value)}
              />
              <button
                type="button"
                className="eye"
                onClick={() => setShowTokenOld((v) => !v)}
              >
                {showTokenOld && <Eye size={20}/>}
                {!showTokenOld && <EyeOff size={20}/>}
              </button>
            </div>
            <DialogFooter>
              <button
                onClick={() => setOpenRemove(false)}
              >
                Cancel
              </button>
              <button
                className="manageButton"
                onClick={() => removeCenter(currentCenter.name)}
              >
                Confirm
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

    </div>
  );
}
