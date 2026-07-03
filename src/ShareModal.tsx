import { XCircle, CloudUpload } from "lucide-react";


interface ShareModalProps {
  centerName: string;
  title: string;
  onClose: () => void;
}


export default function ShareModal({ centerName, title, onClose }: ShareModalProps) {

  const handleEURACAN = () => {
    // Implement the logic to send data to the EURACAN server
    /* HERE */
    console.log(`Sending data for center "${centerName}" to EURACAN server.`);
    alert(`Sending data for center "${centerName}" to EURACAN server.`);
    /* ---- */
    onClose(); // Close the modal after sending
  }

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
          onClick={handleEURACAN}
        >
          <CloudUpload size={16} /> Send to server EURACAN
        </button>
        <button
          id="closeModal"
          className="manageButton"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );

}
