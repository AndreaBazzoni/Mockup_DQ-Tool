import { XCircle, Mail, MessageCircle } from "lucide-react";


interface ShareModalProps {
  centerName: string;
  title: string;
  onClose: () => void;
}


export default function ShareModal({ centerName, title, onClose }: ShareModalProps) {
  const shareText = `Risultati analisi - ${centerName}`;

  const handleEmail = () => {
    // mailto: precompila oggetto/corpo
    window.location.href = `mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(
      "In allegato trovi i risultati dell'analisi. (Ricorda di allegare manualmente il file scaricato)"
    )}`;
    onClose();
  };

  const handleWhatsapp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, "_blank");
    onClose();
  };

  return (
    <div 
      className="modalOverlay"
      onClick={onClose}
    >
      <div
        className="shareModal"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="shareModalHeader"
        >
          <span>{title}</span>
          <button
            onClick={onClose}
            className="buttonX"
          >
            <XCircle size={24}/>
          </button>
        </div>
        <button
          className="shareOption"
          onClick={handleEmail}
        >
          <Mail size={16} /> Invia via email
        </button>
        <button
          className="shareOption"
          onClick={handleWhatsapp}
        >
          <MessageCircle size={16} /> WhatsApp
        </button>
        <button
          id="closeModal"
          className="manageButton"
          onClick={onClose}
        >
          Annulla
        </button>
      </div>
    </div>
  );
}
