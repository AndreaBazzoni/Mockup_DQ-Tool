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
  } catch (err) {
    if (err instanceof TypeError) {
      throw new Error("Impossible to contact REDCap Server.");
    }
    throw err;
  }
  const resultText = await response.text();

  // N.B.: { response.ok = true } solo se status = 200÷299
  if (!response.ok) {
    if (response.status === 403) {
      throw new Error("Invalid token or insufficient permissions.");
    }
    throw new Error(`REDCap error (status ${response.status}): ${resultText}`);
  }

  let result;
  try {
    result = JSON.parse(resultText);
  } catch {
    throw new Error("Impossible to get Metadata.");
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
  } catch (err) {
    if (err instanceof TypeError) {
      throw new Error("Impossible to contact REDCap Server.");
    }
    throw err;
  }
  const resultText = await response.text();

  // N.B.: { response.ok = true } solo se status = 200÷299
  if (!response.ok) {
    if (response.status === 403) {
      throw new Error("Invalid token or insufficient permissions.");
    }
    throw new Error(`REDCap error (status ${response.status}): ${resultText}`);
  }

  let result;
  try {
    result = JSON.parse(resultText);
  } catch {
    throw new Error("Impossible to get Instruments VS Events.");
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
  } catch (err) {
    if (err instanceof TypeError) {
      throw new Error("Impossible to contact REDCap Server.");
    }
    throw err;
  }
  const resultText = await response.text();

  // N.B.: { response.ok = true } solo se status = 200÷299
  if (!response.ok) {
    if (response.status === 403) {
      throw new Error("Invalid token or insufficient permissions.");
    }
    throw new Error(`REDCap error (status ${response.status}): ${resultText}`);
  }

  let result;
  try {
    result = JSON.parse(resultText);
  } catch {
    throw new Error("Impossible to get Repeating Forms Events.");
  }

  return result;
};

