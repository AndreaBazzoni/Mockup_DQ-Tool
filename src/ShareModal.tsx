import { XCircle, CloudUpload } from "lucide-react";
import { toast } from "sonner";
import { shareResultsToS3 } from "@/fetch/share-results";
import { createXlsxFile } from "@/utils/createFile";
import { CurrentAnalysis } from "@/ManageCenters";
import type { Center, REDCapRecord, ShareModalProps } from "@/utils/types";


const handleShareResult = async (
  center: Center,
  title: string,
  result: REDCapRecord[][]
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
      return;
    }
    // File creation
    const file = createXlsxFile(result);
    // Upload diretto su S3
    await shareResultsToS3(presignedUrl, file);
    // Conferma all'utente
    if (title==="quality") {
      toast.success("Sharing di Data Quality avvenuta con successo!");
    }
    if (title==="anonymous") {
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
    if (title==="quality") 
    {
      console.log(`Sending quality data for center "${center.name}" to EURACAN server.`);
      alert(`Sending quality data for center "${center.name}" to EURACAN server.`);
    }

    // Anonymous Data
    else if (title==="anonymous")
    {
      handleShareResult(center, title, result);
    }

    // Unknown title
    else
    {
      console.error(`Unknown title "${title}". Cannot send data to EURACAN server.`);
      alert(`Unknown title "${title}". Cannot send data to EURACAN server.`);
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
