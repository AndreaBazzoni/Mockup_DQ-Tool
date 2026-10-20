import { useEffect, useState } from "react";


export default function Footer() {

  // It reads the application version from the file "version.txt".
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

      {/* Link to Biomeris */}
      {/*
      <span>
        © 2026 <span className="font-semibold">DataQuality Tool</span> <br/>
        Developed by <a href="https://www.biomeris.com/" target="_blank" rel="noopener noreferrer">Biomeris</a>
      </span>
      */}

      {/* Without link */}
      <span>
        © 2026 <span className="font-semibold">DataQuality Tool</span> <br/>
        Developed by Biomeris
      </span>

      {/* Versione */}
      <div style={{ width: "64px" }}>
        {AppVersion()}
      </div>

    </footer>
  );
}