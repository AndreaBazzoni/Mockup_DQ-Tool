import type { REDCapMetadataField, REDCapInstrVsEventsField, REDCapRepeatingsField } from "@/utils/types";



// get Metadata
export const getMetadata = async (
  centerUrl: string,
  token: string
): Promise<REDCapMetadataField[]> => {
  const formdata = new FormData();
  formdata.append("token", token);
  formdata.append("content", "metadata");
  formdata.append("format", "json");
  formdata.append("returnFormat", "json");

  const requestOptions: RequestInit = {
    method: "POST",
    body: formdata,
    redirect: "follow",
  };

  let response: Response;
  try {
    response = await fetch(centerUrl, requestOptions);
  }
  catch (err: unknown) {
    if (err instanceof Error) {
      throw new Error(`Impossible to contact REDCap Server. Details: ${err.message}`, { cause: err });
    }
    else {
      throw new Error(`Unexpected error: ${String(err)}`, { cause: err });
    }
  }
  const resultText = await response.text();

  // NOTE: { response.ok = true } only if status = 200÷299
  if (!response.ok) {
    if (response.status === 403) {
      throw new Error("Invalid token or insufficient permissions.");
    }
    throw new Error(`REDCap error (status ${response.status}): ${resultText}`);
  }

  let result;
  try {
    result = JSON.parse(resultText);
  }
  catch (err: unknown) {
    if (err instanceof Error) {
      throw new Error(`Impossible to get Metadata. Details: ${err.message}`, { cause: err });
    }
    else {
      throw new Error("Impossible to get Metadata.", { cause: err });
    }
  }

  return result;
};


// get Instruments VS Events
export const getInstrVsEvents = async (
  centerUrl: string,
  token: string
): Promise<REDCapInstrVsEventsField[]> => {
  const formdata = new FormData();
  formdata.append("token", token);
  formdata.append("content", "formEventMapping");
  formdata.append("format", "json");
  formdata.append("returnFormat", "json");

  const requestOptions: RequestInit = {
    method: "POST",
    body: formdata,
    redirect: "follow",
  };

  let response: Response;
  try {
    response = await fetch(centerUrl, requestOptions);
  }
  catch (err: unknown) {
    if (err instanceof Error) {
      throw new Error(`Impossible to contact REDCap Server. Details: ${err.message}`, { cause: err });
    }
    else {
      throw new Error(`Unexpected error: ${String(err)}`, { cause: err });
    }
  }
  const resultText = await response.text();

  // NOTE: { response.ok = true } only if status = 200÷299
  if (!response.ok) {
    if (response.status === 403) {
      throw new Error("Invalid token or insufficient permissions.");
    }
    throw new Error(`REDCap error (status ${response.status}): ${resultText}`);
  }

  let result;
  try {
    result = JSON.parse(resultText);
  }
  catch (err: unknown) {
    if (err instanceof Error) {
      throw new Error(`Impossible to get Instruments VS Events. Details: ${err.message}`, { cause: err });
    }
    else {
      throw new Error("Impossible to get Instruments VS Events.", { cause: err });
    }
  }

  return result;
};


// get Repeating Forms Events
export const getRepeatings = async (
  centerUrl: string,
  token: string
): Promise<REDCapRepeatingsField[]> => {
  const formdata = new FormData();
  formdata.append("token", token);
  formdata.append("content", "repeatingFormsEvents");
  formdata.append("format", "json");
  formdata.append("returnFormat", "json");

  const requestOptions: RequestInit = {
    method: "POST",
    body: formdata,
    redirect: "follow",
  };

  let response: Response;
  try {
    response = await fetch(centerUrl, requestOptions);
  }
  catch (err: unknown) {
    if (err instanceof Error) {
      throw new Error(`Impossible to contact REDCap Server. Details: ${err.message}`, { cause: err });
    }
    else {
      throw new Error(`Unexpected error: ${String(err)}`, { cause: err });
    }
  }
  const resultText = await response.text();

  // NOTE: { response.ok = true } only if status = 200÷299
  if (!response.ok) {
    if (response.status === 403) {
      throw new Error("Invalid token or insufficient permissions.");
    }
    throw new Error(`REDCap error (status ${response.status}): ${resultText}`);
  }

  let result;
  try {
    result = JSON.parse(resultText);
  }
  catch (err: unknown) {
    if (err instanceof Error) {
      throw new Error(`Impossible to get Repeating Forms Events. Details: ${err.message}`, { cause: err });
    }
    else {
      throw new Error("Impossible to get Repeating Forms Events.", { cause: err });
    }
  }

  return result;
};


// fetch Records
export const fetchRecords = async (
  centerUrl: string,
  token: string,
  idAttr: string = "record_id"
): Promise<string[]> => {
  const formdata = new FormData();
  formdata.append("token", token);
  formdata.append("content", "record");
  formdata.append("format", "json");
  formdata.append("returnFormat", "json");
  formdata.append("fields", idAttr);

  const requestOptions: RequestInit = {
    method: "POST",
    body: formdata,
    redirect: "follow",
  };

  let response: Response;
  try {
    response = await fetch(centerUrl, requestOptions);
  }
  catch (err: unknown) {
    if (err instanceof Error) {
      throw new Error(`Impossible to contact REDCap Server. Details: ${err.message}`, { cause: err });
    }
    else {
      throw new Error(`Unexpected error: ${String(err)}`, { cause: err });
    }
  }
  const resultText = await response.text();

  // NOTE: { response.ok = true } only if status = 200÷299
  if (!response.ok) {
    if (response.status === 403) {
      throw new Error("Invalid token or insufficient permissions.");
    }
    throw new Error(`REDCap error (status ${response.status}): ${resultText}`);
  }

  let recordsRaw: Record<string, string>[];
  try {
    recordsRaw = JSON.parse(resultText);
  }
  catch (err: unknown) {
    if (err instanceof Error) {
      throw new Error(`Impossible to fetch Records. Details: ${err.message}`, { cause: err });
    }
    else {
      throw new Error("Impossible to fetch Records.", { cause: err });
    }
  }
  const records: string[] = recordsRaw.map((record: any) => record[idAttr]);

  // I remove the duplicates
  const uniqueRecords: string[] = [...new Set(records)];

	return uniqueRecords;
};
