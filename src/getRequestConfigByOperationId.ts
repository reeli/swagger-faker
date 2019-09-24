import { Operation, Reference, Response, Spec } from "swagger-schema-official";
import { find, forEach, get, mapKeys, pick } from "lodash";
import { PathResolver } from "@ts-tool/ts-codegen";
import { pickRefKey } from "./utils";
import { toFakeItems, toFakeObj } from "./faker";
import { Traverse } from "./traverse";
import { booleanGenerator, numberGenerator, stringGenerator } from "./generators";

const getPath = (pathName: string) => pathName.replace(/\{/g, ":").replace(/\}/g, "");

// TODO: responses.200.schema.type ==="array"
// TODO: response.200.schema.type ==="object" (additionalProperties)
// TODO: response.200.schema.type==="string" | "number" | "integer" | "boolean"
// TODO: responses.200.headers 存在时
// TODO: responses.201 同上
const getResponse = (operation: Operation): Response | Reference => {
  const responses = get(operation, "responses");
  const reference = get(operation, "$ref");

  return reference ? reference : get(responses, "200") || get(responses, "201");
};

const getResolvedPathByOperationId = (swagger: Spec, operationId: string) => {
  const resolvedPaths = PathResolver.of(swagger.paths, swagger.basePath).resolve().resolvedPaths;
  return find(resolvedPaths, (item) => item.operationId === operationId);
};

type TMethod = "get" | "post" | "put" | "delete" | "patch" | "options" | "head";

export interface IRequestConfig {
  path: string;
  method: TMethod;
  response: any;
  queryParams: string[];
  basePath: string;
}

const getFakeData = (spec: Spec, response: Response | Reference) => {
  const $ref = get(response, "$ref");
  if ($ref && spec.definitions) {
    const refKey = pickRefKey($ref);
    return toFakeObj(spec.definitions[refKey]);
  }

  const { examples, schema } = response as Response;

  if (examples) {
    return examples;
  }

  if (!spec.definitions || !schema) {
    return {};
  }

  const schemaWithoutRef = Traverse.of(spec.definitions).handleRef(schema);

  switch (schemaWithoutRef.type) {
    case "array":
      return schemaWithoutRef.items ? toFakeItems(schemaWithoutRef) : {};
    case "object":
      return toFakeObj(schemaWithoutRef);
    case "string":
      return stringGenerator();
    case "boolean":
      return booleanGenerator();
    case "number":
    case "integer":
      return numberGenerator();
    default:
      return {};
  }
};

export const getRequestConfigByOperationId = (swagger: Spec, operationId: string): IRequestConfig | null => {
  const resolvedPath = getResolvedPathByOperationId(swagger, operationId);
  let request = null;

  forEach(swagger.paths, (path, pathName) => {
    const operations = pick(path, ["get", "post", "put", "delete", "patch", "options", "head"]);
    mapKeys(operations, (operation, method) => {
      if (operation && operation.operationId === operationId) {
        request = {
          path: getPath(pathName),
          basePath: swagger.basePath,
          method,
          response: getFakeData(swagger, getResponse(operation)),
          queryParams: resolvedPath ? resolvedPath.queryParams : [],
        };
      }
    });
  });

  return request;
};
