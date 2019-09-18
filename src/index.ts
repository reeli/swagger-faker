import { Operation, Schema, Spec } from "swagger-schema-official";
import { Traverse } from "./traverse";
import { toFaker } from "./faker";
import { find, forEach, get, mapKeys, pick } from "lodash";
import { pickRefKey } from "./utils";
import { PathResolver } from "@ts-tool/ts-codegen";

export function generateFakerByDefinitions(definitions: { [definitionsName: string]: Schema }) {
  if (definitions) {
    const data = Traverse.of(definitions).traverse();
    return toFaker(data);
  }
  console.error("You must input definitions!");
  return {};
}

const getPath = (pathName: string, basePath?: string) => {
  const subPath = pathName.replace(/\{/g, ":").replace(/\}/g, "");
  return pathName ? `${basePath}${subPath}` : subPath;
};

const getResponse = (operation: Operation) => {
  const refKey = get(operation, "responses.200.schema.$ref") || get(operation, "responses.201.schema.$ref");
  return pickRefKey(refKey);
};

const getResolvedPathByOperationId = (swagger: Spec, operationId: string) => {
  const resolvedPaths = PathResolver.of(swagger.paths, swagger.basePath).resolve().resolvedPaths;
  return find(resolvedPaths, (item) => item.operationId === operationId);
};

type TMethod = "get" | "post" | "put" | "delete" | "patch" | "options" | "head";

export interface IRequest {
  path: string;
  method: TMethod;
  response: string;
  queryParams: string[];
  basePath: string;
}

export const getRequestByOperationId = (swagger: Spec, operationId: string): IRequest | null => {
  const resolvedPath = getResolvedPathByOperationId(swagger, operationId);
  let request = null;

  forEach(swagger.paths, (path, pathName) => {
    const operations = pick(path, ["get", "post", "put", "delete", "patch", "options", "head"]);
    mapKeys(operations, (operation, method) => {
      if (operation && operation.operationId === operationId) {
        request = {
          path: getPath(pathName, swagger.basePath),
          method,
          response: getResponse(operation),
          queryParams: resolvedPath ? resolvedPath.queryParams : [],
          basePath: swagger.basePath,
        };
      }
    });
  });

  return request;
};
