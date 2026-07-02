// Footer.tsx

export default function Footer() {
  return (
    <footer>
      {/* Logo */}
      <img src="/DQ_Logo-nobg.png" alt="DQ Logo" width="64px" height="64px" />
      <span>
        © 2026 <span className="font-semibold">DataQuality Tool</span> <br/>
        Sviluppato da <a href="https://www.biomeris.com/" target="_blank" rel="noopener noreferrer">Biomeris</a>
      </span>
      <div style={{ width: "64px", height: "64px" }}></div>
    </footer>
  );
}
