import { IOpenAPI, IServer } from "__types__/OpenAPI";
import { putBackRefs } from "./putBackRefs";
import { mapValues, upperCase, isEmpty, get } from "lodash";
import { parse } from "url";
import converter from "swagger2openapi";
import fs from "fs";
import {
  fetchRemoteSpec,
  getFileTypeByPath,
  getFirstSuccessResponse,
  getInputByJson,
  getInputByYaml,
  hasHttpOrHttps,
  isRemoteData,
  toRoutePattern,
} from "./utils";
import { Spec } from "swagger-schema-official";
import { FakeGenOutput } from "__types__/common";
import { FakeDataGenerator } from "./generators";

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

      const fakeDataGenerator = FakeDataGenerator.of(isFixed);
      outputs.push({
        operationId: schema.operationId,
        path: toRoutePattern(`${getBasePathFromServers(openapi?.servers)}${pathName}`),
        method: upperCase(method),
        summary: schema.summary,
        mocks: fakeDataGenerator.toFakeData(schemaWithoutRefs),
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

const fakerGenFromPath = (filePath: string, isFixed?: boolean): Promise<FakeGenOutput[]> => {
  if (hasHttpOrHttps(filePath)) {
    return fetchRemoteSpec(filePath).then((resp) => {
      if (isRemoteData(resp)) {
        return resp.fileType === "yaml"
          ? fakerGen(getInputByYaml(resp.data), isFixed)
          : fakerGen(resp.data as unknown as IOpenAPI, isFixed);
      }
      return resp;
    });
  }
  const fileType = getFileTypeByPath(filePath);
  const fileStr = fs.readFileSync(filePath, "utf8");
  const input = fileType == "yaml" ? getInputByYaml(fileStr) : getInputByJson(fileStr);
  return fakerGen(input, isFixed);
};

const fakerGen = (input: IOpenAPI, isFixed = false) => {
  if (input.swagger === "2.0") {
    return converter
      .convertObj(input, { path: true, warnOnly: true })
      .then((options: any) => fakerGenFromObj(options.openapi, isFixed));
  }

  return fakerGenFromObj(input, false);
};

export { fakerGenFromObj, fakerGenFromPath };
