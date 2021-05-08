import fs from "fs";

export function generateMockFile(fakeDataObj: any, fileName: string, outputFolderName = ".output") {
  const fakeDataStr = JSON.stringify(fakeDataObj, null, 2);
  if (!fs.existsSync(outputFolderName)) {
    fs.mkdirSync(outputFolderName);
  }

  fs.writeFileSync(`${outputFolderName}/${fileName}.json`, fakeDataStr, "utf-8");
}
