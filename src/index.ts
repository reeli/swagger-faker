import fs from "fs";
import * as path from "path";
import { IOpenAPI, IServer } from "./__types__/OpenAPI";
import { putBackRefs } from "./core/putBackRefs";
import { toFakeData } from "./core/faker";
import { mapValues, upperCase, isEmpty, get } from "lodash";
import { getFirstSuccessResponse } from "./core/getFirstSuccessResponse";
import { parse } from "url";

const getOpenApi = (filePath: string) => {
  const schemaStr = fs.readFileSync(path.resolve(__dirname, filePath), "utf8");
  return JSON.parse(schemaStr) as IOpenAPI;
};

export const fakerGen = (openapi: IOpenAPI) => {
  const { basePath, paths } = openapi;
  const outputs: any[] = [];

  mapValues(paths, (pathItem, pathName) => {
    mapValues(pathItem, (schema, method) => {
      const schemaWithoutRefs = putBackRefs({
        schema: (getFirstSuccessResponse(schema.responses) as any)?.data,
        openApi: openapi as IOpenAPI,
        ctx: {
          parents: [],
          currentDepth: undefined,
          maxDepth: 4,
        },
      });
      outputs.push({
        operationId: schema.operationId,
        path: `${getBasePathFromServers(basePath)}${pathName}`,
        method: upperCase(method),
        summary: schema.summary,
        mocks: toFakeData(schemaWithoutRefs),
      });
    });
  });

  return outputs;
};

const getBasePathFromServers = (servers?: IServer[]): string => {
  if (isEmpty(servers)) {
    return "";
  }
  const server = servers![0];
  if (server?.variables) {
    const basePath = get(server, "variables.basePath.default");
    return basePath ? `/${basePath}` : "";
  }
  return parse(server?.url)?.pathname || "";
};

export const fakerGenByPath = (filePath: string) => {
  const openApi = getOpenApi(filePath);
  return fakerGen(openApi);
};
