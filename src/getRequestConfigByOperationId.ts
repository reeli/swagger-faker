import { Header, Operation, ParameterType, Reference, Response, Schema, Spec } from "swagger-schema-official";
import { find, forEach, get, mapKeys, pick } from "lodash";
import { pickRefKey } from "./utils";
import { PathResolver } from "@ts-tool/ts-codegen";

const getPath = (pathName: string) => pathName.replace(/\{/g, ":").replace(/\}/g, "");

export interface IResponse {
  schema: {
    refKey?: string;
    type?: ParameterType;
    additionalProperties?: Schema;
    properties?: Schema;
  };
  headers?: { [headerName: string]: Header };
  examples?: { [exampleName: string]: {} };
}

const getResponseSchemaByName = (
  responses: { [responseName: string]: Response | Reference },
  responseName: string,
): IResponse["schema"] => {
  const response = get(responses, responseName);
  if (!response) {
    return {} as IResponse["schema"];
  }

  const reference = get(response, ["$ref"]);
  if (reference) {
    return {
      refKey: pickRefKey(reference),
    };
  }

  const schemaRef = get(response, ["schema", "$ref"]);

  if (schemaRef) {
    return {
      refKey: pickRefKey(schemaRef),
    };
  }

  const type = get(response, ["schema", "type"]);

  if (type === "array") {
    //TODO: 处理 array 中又嵌套 array 的 case
    return {
      refKey: pickRefKey(get(response, ["schema", "items", "$ref"])),
      type: "array",
    };
  }

  if (type === "object") {
    // TODO: 处理 properties 中包含 $ref 的场景
    const properties = get(response, ["schema", "properties"]);
    const additionalProperties = get(response, ["schema", "additionalProperties"]);
    return {
      type: "object",
      properties,
      additionalProperties,
    };
  }

  return {
    type,
  };
};

const getResponse = (operation: Operation): IResponse => {
  // TODO: responses.200.schema.type ==="array"
  // TODO: response.200.schema.type ==="object" (additionalProperties)
  // TODO: response.200.schema.type==="string" | "number" | "integer" | "boolean"
  // TODO: responses.200.headers 存在时
  // TODO: responses.201 同上

  const responses = get(operation, "responses");
  const headers = get(operation, "responses.200.headers") || get(operation, "responses.201.headers");
  const examples = get(operation, "responses.200.examples") || get(operation, "responses.201.examples");

  return {
    schema: getResponseSchemaByName(responses, "200") || getResponseSchemaByName(responses, "200"),
    headers,
    examples,
  };
};

const getResolvedPathByOperationId = (swagger: Spec, operationId: string) => {
  const resolvedPaths = PathResolver.of(swagger.paths, swagger.basePath).resolve().resolvedPaths;
  return find(resolvedPaths, (item) => item.operationId === operationId);
};

type TMethod = "get" | "post" | "put" | "delete" | "patch" | "options" | "head";

export interface IRequestConfig {
  path: string;
  method: TMethod;
  response: IResponse;
  queryParams: string[];
  basePath: string;
}

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
          response: getResponse(operation),
          queryParams: resolvedPath ? resolvedPath.queryParams : [],
        };
      }
    });
  });

  return request;
};
