import { getUnifiedInputs, getPathsFromRef } from "@ts-tool/ts-codegen-core";
import { keys, Dictionary, first, values, mapValues, upperCase } from "lodash";
import fs from "fs";
import * as path from "path";
import { IOpenAPI, IResponse, IComponents, IReference } from "./__types__/OpenAPI";

interface Mock {
  status: string;
  response: any;
  test: ({ query, params }: { query: object; params: object }) => boolean;
}

export interface Output {
  operationId: string;
  path: string;
  method: string;
  mocks: Mock[];
  summary?: string;
}

export const bootstrap = (openapi: IOpenAPI) => {
  const { basePath, paths } = getUnifiedInputs(openapi);
  // TODO: remove any type later
  const outputs: any[] = [];

  mapValues(paths, (pathItem, pathName) => {
    mapValues(pathItem, (schema, method) => {
      outputs.push({
        operationId: schema.operationId,
        path: `${basePath}${pathName}`,
        method: upperCase(method),
        summary: schema.summary,
        mocks: generateMocks(schema.responses, openapi),
      });
    });
  });

  return outputs;
};

const generateMocks = (responses: IComponents["responses"], spec: IOpenAPI) => {
  return [getResponseData(responses, spec)];
};

export const getResponseData = (responses: IComponents["responses"], spec: IOpenAPI) => {
  if (!responses) {
    return;
  }

  let successResp: { status: number; resp?: IReference | IResponse } | null = null;

  keys(responses).forEach((code) => {
    const resp = responses[code] as any;
    const hasContent = getRef(resp) || getFirstValue(resp.content).schema;

    const httpCode = Number(code);
    if (httpCode >= 200 && httpCode < 300 && hasContent && !successResp) {
      successResp = {
        status: httpCode,
        resp,
      };
    }
  });

  return successResp
    ? {
        status: (successResp as any).status,
        // TODO: remove any later
        response: handleResponse(spec, (successResp as any).resp),
      }
    : null;
};

const handleResponse = (_: IOpenAPI, resp?: IReference | IResponse) => {
  if (getRef(resp)) {
    getPathsFromRef(resp.$ref);
    return;
  }

  return {};
};

const getRef = (v: any): v is IReference => v.$ref;

const getFirstValue = (data?: Dictionary<any>) => first(values(data)) || {};

const schemaStr = fs.readFileSync(path.resolve(__dirname, "../examples/openapi.json"), "utf8");
const finalSchemaStr = schemaStr.replace(/#\/definitions\/File/gi, "");
const swagger = JSON.parse(finalSchemaStr) as IOpenAPI;
console.log(JSON.stringify(bootstrap(swagger), null, 2));
