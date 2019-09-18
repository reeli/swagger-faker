import * as fs from "fs";
import { Spec } from "swagger-schema-official";
import { getRequestByOperationId, IRequest } from "../src";
import { printFaker } from "../src/printer";
import { getInsertFileStr, prettifyCode } from "./utils";
import { isEmpty, map } from "lodash";

const mockServerConfig = {
  db: "./examples/mock-server-config/db.js",
  routes: "./examples/mock-server-config/routes.json",
};

const getRoutePath = (basePath: string, path: string, queryParams?: string[]) => {
  const queryList = map(queryParams, (param) => `${param}=:${param}`);
  return !isEmpty(queryParams) ? `${basePath}${path}?${queryList.join("&")}` : `${basePath}${path}`;
};

const writeRoutes = (req: IRequest, operationId: string) => {
  const routes = fs.readFileSync(mockServerConfig.routes, "utf-8");
  const routesObj = JSON.parse(routes);
  const newRoutes = routesObj[req.path]
    ? routesObj
    : {
        ...routesObj,
        [getRoutePath(req.basePath, req.path, req.queryParams)]: `./${operationId}`,
      };

  fs.writeFileSync(mockServerConfig.routes, JSON.stringify(newRoutes, null, 2));
};

const configMockServer = (swagger: Spec, operationId: string) => {
  const request = getRequestByOperationId(swagger, operationId);

  if (!request) {
    return;
  }

  if (request.response) {
    printFaker(swagger, request.response);
  }

  if (request.method === "get") {
    const fileStr = fs.readFileSync(mockServerConfig.db, "utf-8");
    const result = getInsertFileStr(fileStr, operationId);

    writeRoutes(request, operationId);

    if (result && result.code) {
      const code = prettifyCode(result.code);
      fs.writeFileSync(mockServerConfig.db, code);
    }
  }

  if (request.method === "post") {
  }
};

const schemaStr = fs.readFileSync("./examples/swagger.json", "utf8");
const swagger = JSON.parse(schemaStr) as Spec;

configMockServer(swagger, "downloadUsingGET");
