import { XCircle, CloudUpload } from "lucide-react";


interface ShareModalProps {
  centerName: string;
  title: string;
  onClose: () => void;
}


export default function ShareModal({ centerName, title, onClose }: ShareModalProps) {

  const handleEURACAN = () => {
    // Implement the logic to send data to the EURACAN server
    /* -- HERE -- */

    // Data Quality
    if (title==="quality") 
    {
      console.log(`Sending quality data for center "${centerName}" to EURACAN server.`);
      alert(`Sending quality data for center "${centerName}" to EURACAN server.`);
    }

    // Anonymous Data
    else if (title==="anonymous")
    {
      console.log(`Sending anonymous data for center "${centerName}" to EURACAN server.`);
      alert(`Sending anonymous data for center "${centerName}" to EURACAN server.`);
    }

    // Unknown title
    else
    {
      console.error(`Unknown title "${title}". Cannot send data to EURACAN server.`);
      alert(`Unknown title "${title}". Cannot send data to EURACAN server.`);
    }
    /* ---------- */
    
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
          <span>Share {title}</span>
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
