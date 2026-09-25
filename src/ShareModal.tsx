import { XCircle, CloudUpload } from "lucide-react";
import { toast } from "sonner";
import { shareResultsToS3 } from "@/fetch/share-results";
import { createXlsxFile, createTxtFile } from "@/utils/createFile";
import { CurrentAnalysis } from "@/ManageCenters";
import type { Center, REDCapRecord, DQRecord, ShareModalProps } from "@/utils/types";


const handleShareResultQuality = async (
  center: Center,
  title: string,
  result: DQRecord
): Promise<void> => {
  console.log(`Sending quality data for center "${center.name}" to EURACAN server.`);
  alert(`Sending quality data for center "${center.name}" to EURACAN server.`);
  try {
    // Costruisco la URL
    const presignedUrl = `https://test-ehedq-upload-public.s3.amazonaws.com/DQ_${CurrentAnalysis}-${center.id}.xlsx`;
    // File creation
    // -------- CAMBIA --------
    const file = createTxtFile(["1","2","3"], "prova");
    // ------------------------
    // Upload diretto su S3
    await shareResultsToS3(presignedUrl, file);
    // Conferma all'utente
    if (title === "quality") {
      toast.success("Sharing di Data Quality avvenuta con successo!");
    }
    if (title === "anonymous") {
      toast.success("Sharing di Anonymous Data avvenuta con successo!");
    }

  } catch (err: any) {
    console.error(err.message || "Error during the Data Sharing.");
    toast.error(err.message || "Error during the Data Sharing.");
  }
};


const handleShareResultAnonymous = async (
  center: Center,
  title: string,
  result: REDCapRecord[][]
): Promise<void> => {
  try {
    // Costruisco la URL
    const presignedUrl = `https://test-ehedq-upload-public.s3.amazonaws.com/EXPORT_${CurrentAnalysis}-${center.id}.xlsx`;
    // File creation
    const file = createXlsxFile(result);
    // Upload diretto su S3
    await shareResultsToS3(presignedUrl, file);
    // Conferma all'utente
    if (title === "quality") {
      toast.success("Sharing di Data Quality avvenuta con successo!");
    }
    if (title === "anonymous") {
      toast.success("Sharing di Anonymous Data avvenuta con successo!");
    }

  } catch (err: any) {
    console.error(err.message || "Error during the Data Sharing.");
    toast.error(err.message || "Error during the Data Sharing.");
  }
};


export default function ShareModal({ center, title, result, onClose }: ShareModalProps) {

  const handleEURACAN = () => {

    // Data Quality
    if (title === "quality") 
    {
      handleShareResultQuality(center, title, result);
    }

    // Anonymous Data
    else if (title === "anonymous")
    {
      handleShareResultAnonymous(center, title, result);
    }

    // Unknown title
    else
    {
      console.error("Cannot send data to EURACAN server.");
      alert("Cannot send data to EURACAN server.");
    }
    
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
