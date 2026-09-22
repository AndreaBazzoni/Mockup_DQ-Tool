import { fetchFileRepository, fetchCohort, getCohort, createFileCohort, createDirectory } from "@/fetch/redcap-fetch";
import type { Center, REDCapRecord } from "@/utils/types";
import { createTxtFile } from "@/utils/createFile";
import { achieveRecordData } from "@/utils/achieveRecordData";


export const ManageCohort = async (
  center: Center,
  token: string,
  currentAnalysis: string
): Promise<{ cohort: string[] | null; recordData: REDCapRecord[][] | null }> => {

  // ---- GESTIONE COMPILAZIONE ---- //
  const nameDirectory = "EHE-Federated";
  const nameFileCohort = `${currentAnalysis}_${center.id}_cohort.txt`;
  // ------------------------------- //

  const fileRepository = await fetchFileRepository(center.url, token, "");
  let directoryExists = fileRepository.find((dir: any) => dir.name === nameDirectory);

  if (!directoryExists) {
    await createDirectory(center.url, token, nameDirectory, "");
    const fileRepositoryNew = await fetchFileRepository(center.url, token, "");
    directoryExists = fileRepositoryNew.find((dir: any) => dir.name === nameDirectory);
  }

  const fileRepositoryEHE = await fetchFileRepository(center.url, token, directoryExists.folder_id);
  const fileCohortExists = fileRepositoryEHE.find((file: any) => file.name === nameFileCohort);

  let cohort: string[];

  if (fileCohortExists) {
    cohort = await getCohort(center.url, token, fileCohortExists.doc_id);
  } else {
    const totalData = await fetchCohort(center.url, token);
    const recordIds = [...new Set(totalData.map((patient: any) => patient.bl_record_id))] as string[];
    const cohortTxtFile = createTxtFile(recordIds, nameFileCohort);
    await createFileCohort(center.url, token, cohortTxtFile, directoryExists.folder_id);
    cohort = recordIds;
  }

  const recordData = await achieveRecordData(center.url, token, cohort);

  return { cohort, recordData };
};
