import { IOpenAPI, IServer } from "OpenAPI";
import { putBackRefs } from "./putBackRefs";
import { toFakeData } from "./toFakeData";
import { mapValues, upperCase, isEmpty, get } from "lodash";
import { parse } from "url";
import converter from "swagger2openapi";
import { getFirstSuccessResponse, getInput } from "./utils";

const fakerGenFromObj = (openapi: IOpenAPI, isRandom: boolean) => {
  const outputs: any[] = [];

  mapValues(openapi.paths, (pathItem, pathName) => {
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
        path: `${getBasePathFromServers(openapi?.servers)}${pathName}`,
        method: upperCase(method),
        summary: schema.summary,
        mocks: toFakeData(schemaWithoutRefs, isRandom),
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

const fakerGenFromPath = (filePath: string) => {
  const input = getInput(filePath);
  if (input.swagger === "2.0") {
    return converter.convertObj(input, { path: true, warnOnly: true }).then((options: any) => {
      return fakerGenFromObj(options.openapi, true);
    });
  }

  return Promise.resolve(fakerGenFromObj(input, true));
};

export { fakerGenFromObj, fakerGenFromPath };
