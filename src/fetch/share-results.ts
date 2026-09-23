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

  } catch (err) {
    if (err instanceof TypeError) {
      throw new Error("Impossible to contact the storage server.");
    }
    throw err;
  }

  if (!response.ok) {
    throw new Error(`Error during upload to S3 (status ${response.status})`);
  }

  // Console.log di verifica
  console.log("Upload S3: end - correctly completed!");
};
