import { useState } from "react";
import { XCircle, CloudUpload } from "lucide-react";
import { toast } from "sonner";
import { shareResultsToS3 } from "@/fetch/share-results";
import { obtainParamsExcelDQ } from "@/utils/obtainParamsExcelDQ";
import { createXlsxFile, createExcelDQ } from "@/utils/createFile";
import { CurrentAnalysis } from "@/ManageCenters";
import type { Center, REDCapRecord, DQRecord, ShareModalProps } from "@/utils/types";
import type { REDCapMetadataField, REDCapInstrVsEventsField, REDCapRepeatingsField } from "@/utils/types";


const handleShareResultQuality = async (
  center: Center,
  title: string,
  result: Record<string, DQRecord>,
  timestamp: string,
  token: string,
  metadata: REDCapMetadataField[],
  instrumentsVsEvents: REDCapInstrVsEventsField[],
  repeatings: REDCapRepeatingsField[]
): Promise<void> => {
  try {
    // Costruisco la URL
    const presignedUrl = `https://test-ehedq-upload-public.s3.amazonaws.com/DQ_${CurrentAnalysis}_${center.id}_${timestamp}.xlsx`;
    // File creation
    const rslt = await obtainParamsExcelDQ(center.url, token, metadata, instrumentsVsEvents, repeatings);
    const {unknownSummaryState, timelineSummaryState, baselineCountersState, diseaseExtensionCountersState} = rslt;
    const file = createExcelDQ(result, metadata, unknownSummaryState, timelineSummaryState, baselineCountersState, diseaseExtensionCountersState);
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
  result: REDCapRecord[][],
  timestamp: string,
): Promise<void> => {
  try {
    // Costruisco la URL
    const presignedUrl = `https://test-ehedq-upload-public.s3.amazonaws.com/EXPORT_${CurrentAnalysis}_${center.id}_${timestamp}.xlsx`;
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


export default function ShareModal(props: ShareModalProps) {
  const { center, title, result, onClose } = props;
  const [isSharing, setIsSharing] = useState(false);

  const handleEURACAN = async () => {
    setIsSharing(true);

    // -- Generazione Data/Ora per nome del file --
    // Generate a timestamp for the file name
    const now = new Date();

    // Anno = presente
    const dateString = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    // Anno = assente
    //const dateString = `${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    const hourString = `${String(now.getHours()).padStart(2, '0')}`;
    const minuteString = `${String(now.getMinutes()).padStart(2, '0')}`;
    const secondString = `${String(now.getSeconds()).padStart(2, '0')}`;

    const timestamp = `${dateString}_${hourString}${minuteString}${secondString}`;
    // --------------------------------------------


    try {
      // Data Quality
      if (title === "quality") {
        const { token, metadata, instrumentsVsEvents, repeatings } = props;
        await handleShareResultQuality(center, title, result, timestamp, token, metadata, instrumentsVsEvents, repeatings);
      }

      // Anonymous Data
      else if (title === "anonymous") {
        await handleShareResultAnonymous(center, title, result, timestamp);
      }

      // Unknown title
      else {
        console.error("Cannot send data to EURACAN server.");
        alert("Cannot send data to EURACAN server.");
      }
    }

    catch (err: any) {
      console.error(err.message || "Error during the sharing.");
      toast.error(err.message || "Error during the sharing.");
    }

    finally {
      setIsSharing(false);
      onClose(); // Close the modal after sending
    }
  }


  return (
    <div 
      className="modalOverlay"
      onClick={isSharing ? undefined : onClose}
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
            disabled={isSharing}
          >
            <XCircle size={24}/>
          </button>
        </div>
        <button
          className="shareOption"
          onClick={handleEURACAN}
          disabled={isSharing}
        >
          <CloudUpload size={16} /> Send to server EURACAN
        </button>
        <button
          id="closeModal"
          className="manageButton"
          onClick={onClose}
          disabled={isSharing}
        >
          Cancel
        </button>
      </div>

    </div>
  );
}
