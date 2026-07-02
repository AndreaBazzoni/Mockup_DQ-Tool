import { useEffect, useState } from "react";


export default function Footer() {

  // Legge la versione dell'applicazione da version.txt
  function AppVersion() {
    const [version, setVersion] = useState("");
    useEffect(() => {
      fetch('/version.txt').then(r => r.text()).then(setVersion);
    }, []);
    return <>{version}</>;
  }

  return (
    <footer>
      {/* Logo */}
      <img src="/DQ_Logo-nobg.png" alt="DQ Logo" width="64px" height="64px" />
      <span>
        © 2026 <span className="font-semibold">DataQuality Tool</span> <br/>
        Sviluppato da <a href="https://www.biomeris.com/" target="_blank" rel="noopener noreferrer">Biomeris</a>
      </span>
      {/* Versione */}
      <div style={{ width: "64px" }}>
        {AppVersion()}
      </div>
    </footer>
  );
}
