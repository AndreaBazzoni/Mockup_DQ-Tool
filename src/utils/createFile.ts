export const createTxtFile = (ids: string[], fileName: string): File => {
  const content = ids.join("\n");
  return new File([content], fileName, { type: "text/plain" });
};