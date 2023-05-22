import { IReference, IComponents, IResponse, IOpenAPI } from "__types__/OpenAPI";
import { Dictionary, first, values, keys } from "lodash";
import fs from "fs";
import { pathToRegexp } from "path-to-regexp";
import yaml from "js-yaml";

export const getRef = (v: any): v is IReference => v?.$ref;

const getFirstValue = (data?: Dictionary<any>) => first(values(data));
const getFirstKey = (data?: Dictionary<any>) => first(keys(data));

export const getFirstSuccessResponse = (responses: IComponents["responses"]) => {
  if (!responses) {
    return;
  }

  let firstSuccessResp: IReference | IResponse | undefined = undefined;

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
    description: (firstSuccessResp as any)?.description,
  };
};

export function generateMockFile(fakeDataObj: any, fileName: string, outputFolderName = ".output") {
  if (!fakeDataObj || !isJSON(fakeDataObj)) {
    return;
  }

  const fakeDataStr = JSON.stringify(fakeDataObj, null, 2);
  if (!fs.existsSync(outputFolderName)) {
    fs.mkdirSync(outputFolderName);
  }

  fs.writeFileSync(`${outputFolderName}/${fileName}.json`, fakeDataStr, "utf-8");
}

export const getInput = (filePath: string) => JSON.parse(fs.readFileSync(filePath, "utf8")) as IOpenAPI;
export const getInputByYaml = (filePath: string) => yaml.load(fs.readFileSync(filePath, "utf8")) as IOpenAPI;

export const isJSON = (data: any) => {
  let res = typeof data === "string" ? data : JSON.stringify(data);

  try {
    res = JSON.parse(res);
  } catch (e) {
    return false;
  }

  return typeof res === "object" && res !== null;
};

export const toRoutePattern = (route: string) => route.replace(/\{/gi, ":").replace(/\}/gi, "");

export const isMatch = (routePattern: string) => (routePath: string) => {
  const regexp = pathToRegexp(routePattern);
  return !!regexp.exec(routePath);
};

export const getFileTypeByPath = (path: string) => {
  if (path.includes("json")) {
    return "json";
  }

  if (path.includes("yaml") || path.includes("yml")) {
    return "yaml";
  }

  return "";
};
