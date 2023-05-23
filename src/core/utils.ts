import { IReference, IComponents, IResponse, IOpenAPI } from "__types__/OpenAPI";
import axios, { AxiosError } from "axios";
import { Dictionary, first, values, keys } from "lodash";
import fs from "fs";
import { pathToRegexp } from "path-to-regexp";
import yaml from "js-yaml";
import url from "url";

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

export const getInputByJson = (data: string) => JSON.parse(data) as IOpenAPI;
export const getInputByYaml = (data: string) => yaml.load(data) as IOpenAPI;

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
  if (path.endsWith(".json")) {
    return "json";
  }

  if (path.endsWith(".yaml") || path.endsWith(".yml")) {
    return "yaml";
  }

  return "";
};

export const getFileTypeByContentType = (contentType: string) => {
  if (contentType.includes("json")) {
    return "json";
  }

  if (contentType.includes("yaml") || contentType.includes("yml")) {
    return "yaml";
  }

  return "";
};

export interface RemoteData {
  data: string;
  fileType: "yaml" | "json";
}
export const isRemoteData = (resp: any): resp is RemoteData => resp.data;

export const fetchRemoteSpec = (url: string, timeout: number = 180000): Promise<RemoteData | AxiosError> => {
  const instance = axios.create({ timeout });

  return instance
    .get(url)
    .then((response) => {
      return {
        data: response.data,
        fileType: getFileTypeByContentType(response.headers["content-type"]),
      };
    })
    .catch((error) => {
      console.error(`${error.code}: Fetch failed! Please checkout your network or swagger-faker.config.json file.`);
      return error;
    });
};

export const hasHttpOrHttps = (path: string) => {
  const { protocol } = url.parse(path);
  return protocol && /https?:/.test(protocol);
};
