import { IOpenAPI, IServer } from "__types__/OpenAPI";
import { putBackRefs } from "./putBackRefs";
import { toFakeData } from "./toFakeData";
import { mapValues, upperCase, isEmpty, get } from "lodash";
import { parse } from "url";
import converter from "swagger2openapi";
import {getFirstSuccessResponse, getInput, toRoutePattern} from "./utils";
import { Spec } from "swagger-schema-official";
import { FakeGenOutput } from "__types__/common";

const fromOpenApi = (openapi: IOpenAPI, isFixed: boolean): FakeGenOutput[] => {
  const outputs: FakeGenOutput[] = [];

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
        path: toRoutePattern(`${getBasePathFromServers(openapi?.servers)}${pathName}`),
        method: upperCase(method),
        summary: schema.summary,
        mocks: toFakeData(schemaWithoutRefs, isFixed),
      });
    });
  });

  return outputs;
};

const fakerGenFromObj = (data: IOpenAPI | Spec, isFixed: boolean) => {
  if (data.swagger === "2.0") {
    return converter
      .convertObj(data, { path: true, warnOnly: true })
      .then((options: { openapi: IOpenAPI }) => fromOpenApi(options.openapi, isFixed));
  }

  return Promise.resolve(fromOpenApi(data as IOpenAPI, isFixed));
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

const fakerGenFromPath = (filePath: string): Promise<FakeGenOutput[]> => {
  const input = getInput(filePath);
  if (input.swagger === "2.0") {
    return converter
      .convertObj(input, { path: true, warnOnly: true })
      .then((options: any) => fakerGenFromObj(options.openapi, false));
  }

  return fakerGenFromObj(input, false);
};

export { fakerGenFromObj, fakerGenFromPath };
