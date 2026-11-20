export const shareResultsToS3 = async (
  presignedUrl: string,
  file: Blob | File
): Promise<void> => {
  let response: Response;

  // Console.log di verifica
  console.log("Upload S3: start - ", {
    url: presignedUrl,
    fileName: file instanceof File ? file.name : "Blob",
    size: file.size,
    type: file.type,
  });

  try {
    response = await fetch(presignedUrl, {
      method: "PUT",
      headers: {
        "x-amz-acl": "bucket-owner-full-control",
      },
      body: file,
    });

    // Console.log di verifica
    console.log("Upload S3: response - ", {
      status: response.status,
      ok: response.ok,
    });
  }
  catch (err: unknown) {
    if (err instanceof Error) {
      throw new Error(`Impossible to contact the storage server: ${err.message}`, { cause: err });
    }
    else {
      throw new Error("Impossible to contact the storage server.", { cause: err });
    }
  }

  if (!response.ok) {
    throw new Error(`Error during upload to S3 (status ${response.status})`);
  }

  // Console.log di verifica
  console.log("Upload S3: end - correctly completed!");
};
