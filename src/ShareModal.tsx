import { XCircle, CloudUpload } from "lucide-react";
import { toast } from "sonner";
import { shareResultsToS3 } from "@/fetch/share-results";
import { createXlsxFile } from "@/utils/createFile";
import { CurrentAnalysis } from "@/ManageCenters";
import type { Center, REDCapRecord, ShareModalProps } from "@/utils/types";


const handleShareResult = async (
  center: Center,
  title: string,
  recordData: REDCapRecord[][]
): Promise<void> => {
  try {
    // Costruisco la URL
    let presignedUrl;
    if (title==="quality") {
      presignedUrl = `https://test-ehedq-upload-public.s3.amazonaws.com/export_quality_${CurrentAnalysis}-${center.id}`;
    }
    else if (title==="anonymous") {
      presignedUrl = `https://test-ehedq-upload-public.s3.amazonaws.com/export_quality_${CurrentAnalysis}-${center.id}`;
    }
    else {
      console.error(`Unknown title "${title}". Cannot send data to EURACAN server.`);
      alert(`Unknown title "${title}". Cannot send data to EURACAN server.`);
    }

    // Upload diretto su S3
    await shareResultToS3(presignedUrl, file);

    // Conferma all'utente
    showToast("Risultato condiviso correttamente.", "success");

  } catch (err) {
    // 4. Errore in uno dei due passaggi
    console.error(err);

    showToast(
      err instanceof Error
        ? err.message
        : "Errore durante la condivisione del risultato.",
      "error"
    );
  }
};


export default function ShareModal({ center, title, onClose }: ShareModalProps) {

  const handleEURACAN = () => {
    // Implement the logic to send data to the EURACAN server
    /* -- HERE -- */

    // Data Quality
    if (title==="quality") 
    {
      console.log(`Sending quality data for center "${center.name}" to EURACAN server.`);
      alert(`Sending quality data for center "${center.name}" to EURACAN server.`);
    }

    // Anonymous Data
    else if (title==="anonymous")
    {
      handleShareResult(center, title, file);
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
