import {IReference, IComponents, IResponse, IOpenAPI} from "OpenAPI";
import {Dictionary, first, values, keys} from "lodash";
import fs from "fs";

export const getRef = (v: any): v is IReference => v?.$ref;

const getFirstValue = (data?: Dictionary<any>) => first(values(data));
const getFirstKey = (data?: Dictionary<any>) => first(keys(data));

export const getFirstSuccessResponse = (responses: IComponents["responses"])=>{
  if (!responses) {
    return;
  }

  let firstSuccessResp:  IReference | IResponse | undefined = undefined;

  keys(responses).forEach((code) => {
    const httpCode = Number(code);
    const resp = responses[code];
    const hasContent = getRef(resp) || getFirstValue(resp?.content)?.schema;

    if (httpCode >= 200 && httpCode < 300 && hasContent && !firstSuccessResp) {
      firstSuccessResp = resp;
    }
  });

  return {
    contentType: getFirstKey((firstSuccessResp as any)?.content) || "application/json",
    data: (firstSuccessResp as any)?.$ref || getFirstValue((firstSuccessResp as any)?.content)?.schema,
    description:(firstSuccessResp as any)?.description
  };
}

export function generateMockFile(fakeDataObj: any, fileName: string, outputFolderName = ".output") {
  const fakeDataStr = JSON.stringify(fakeDataObj, null, 2);
  if (!fs.existsSync(outputFolderName)) {
    fs.mkdirSync(outputFolderName);
  }

  fs.writeFileSync(`${outputFolderName}/${fileName}.json`, fakeDataStr, "utf-8");
}

export const getInput = (filePath: string) => JSON.parse(fs.readFileSync(filePath, "utf8")) as IOpenAPI;
