export const fetchFileRepository = async (centerUrl: string, token: string, folder_id: string) => {
  const formdata = new FormData();
  formdata.append("token", token);
  formdata.append("content", "fileRepository");
  formdata.append("action", "list");
  formdata.append("format", "json");
  formdata.append("folder_id", folder_id);
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
    throw new Error("Invalid REDCap response (unexpected format).");
  }

  return result;
};


export const getCohort = async (centerUrl: string, token: string, doc_id: string) => {
  const formdata = new FormData();
  formdata.append("token", token);
  formdata.append("content", "fileRepository");
  formdata.append("action", "export");
  formdata.append("doc_id", doc_id);
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
    // Testo semplice (un id per riga)
    result = resultText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
      // dividi le righe in elementi, li ripulisci, togli gli elementi vuoti.
  } catch {
    throw new Error("Impossible to read the cohort.");
  }

  return result;
};


export const fetchCohort = async (centerUrl: string, token: string) => {
  const formdata = new FormData();
  formdata.append("token", token);
  formdata.append("content", "record");
  formdata.append("action", "export");
  formdata.append("format", "json");
  formdata.append("type", "flat");
  formdata.append("rawOrLabel", "raw");
  formdata.append("rawOrLabelHeaders", "raw");
  formdata.append("exportCheckboxLabel", "false");
  formdata.append("exportSurveyFields", "false");
  formdata.append("exportDataAccessGroups", "false");
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
    throw new Error("Impossible to download the cohort.");
  }

  return result;
};


export const createFileCohort = async (centerUrl: string, token: string, file: File, dirId: string) => {
  const formdata = new FormData();
  formdata.append("token", token);
  formdata.append("content", "fileRepository");
  formdata.append("action", "import");
  formdata.append("returnFormat", "json");
  formdata.append("file", file);
  formdata.append("folder_id", dirId);

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
};


export const createDirectory = async (centerUrl: string, token: string, name: string, nameDir: string) => {
  const formdata = new FormData();
  formdata.append("token", token);
  formdata.append("content", "fileRepository");
  formdata.append("action", "createFolder");
  formdata.append("format", "json");
  formdata.append("name", name);
  formdata.append("folder_id", nameDir);

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
};
