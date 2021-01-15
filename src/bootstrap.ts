import { getUnifiedInputs, CustomSpec, CustomReference, getPathsFromRef } from "@ts-tool/ts-codegen-core";
import { keys, Dictionary, first, values } from "lodash";
import fs from "fs";
import { Spec } from "swagger-schema-official";
import * as path from "path";

export const bootstrap = (spec: CustomSpec) => {
  const { basePath, paths } = getUnifiedInputs(spec);
  keys(paths).forEach((path) => {
    keys(paths[path]).forEach((method) => {
      const res = {} as any;
      res[paths[path][method].operationId] = {
        path: `${basePath}/${path}`,
        method,
        responseData: getResponseData(paths[path][method].responses),
      };
    });
  });
};

export const getResponseData = <TResponse>(responses?: { [responseName: string]: TResponse | CustomReference }) => {
  if (!responses) {
    return;
  }

  let firstSuccessResp: TResponse | CustomReference | null = null;

  keys(responses).forEach((code) => {
    const httpCode = Number(code);
    const resp = responses[code];
    const a = ((resp as any) || {}).schema;
    const b = getFirstValue(((resp as any) || {}).content).schema;
    const hasContent = getRef(resp) || a || b;

    if (httpCode >= 200 && httpCode < 300 && hasContent && !firstSuccessResp) {
      firstSuccessResp = resp;
    }
  });

  return firstSuccessResp ? handleResponse<TResponse>(firstSuccessResp) : null;
};

const handleResponse = <TResponse>(resp: TResponse | CustomReference) => {
  if (getRef(resp)) {
    getPathsFromRef(resp.$ref);
    return;
  }

  console.log(resp, "resp");
  return;
};

const getRef = (v: any): v is CustomReference => v.$ref;

const getFirstValue = (data?: Dictionary<any>) => first(values(data)) || {};

const schemaStr = fs.readFileSync(path.resolve(__dirname, "../examples/swagger1.json"), "utf8");
const finalSchemaStr = schemaStr.replace(/#\/definitions\/File/gi, "");
const swagger = JSON.parse(finalSchemaStr) as Spec;
bootstrap(swagger);
