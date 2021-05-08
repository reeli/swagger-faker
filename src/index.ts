import fs from "fs";
import { IOpenAPI, IServer } from "./__types__/OpenAPI";
import { putBackRefs } from "./core/putBackRefs";
import { toFakeData } from "./core/faker";
import { mapValues, upperCase, isEmpty, get } from "lodash";
import { getFirstSuccessResponse } from "./core/getFirstSuccessResponse";
import { parse } from "url";
import converter from "swagger2openapi";

const getInput = (filePath: string) => JSON.parse(fs.readFileSync(filePath, "utf8")) as IOpenAPI;

export const fakerGenFromObj = (openapi: IOpenAPI) => {
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

export const fakerGenFromPath = (filePath: string) => {
  const input = getInput(filePath);
  if (input.swagger === "2.0") {
    return converter.convertObj(input, { path: true, warnOnly: true }).then((options: any) => {
      return fakerGenFromObj(options.openapi);
    });
  }

  return Promise.resolve(fakerGenFromObj(input));
};

// fakerGenFromPath("/Users/rrli/tw/gitRepo/swagger-faker/examples/openapi.json").then((v: any) => {
//   console.log(v, "v");
// });
