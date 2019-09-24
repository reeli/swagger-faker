import * as fs from "fs";
import { Spec } from "swagger-schema-official";
import { getRequestConfigByOperationId, IRequestConfig } from "../src";
import { getInsertFileStr, prettifyCode, printFaker } from "./utils";
import { isEmpty, map, toUpper } from "lodash";

const mockServerConfig = {
  db: "./examples/mock-server-config/db.js",
  routes: "./examples/mock-server-config/routes.json",
};

const getRoutePath = (basePath: string, path: string, queryParams?: string[]) => {
  const queryList = map(queryParams, (param) => `${param}=:${param}`);
  return !isEmpty(queryParams) ? `${basePath}${path}?${queryList.join("&")}` : `${basePath}${path}`;
};

const writeRoutes = (req: IRequestConfig, operationId: string) => {
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

export const configMockServer = (swagger: Spec, operationId: string) => {
  const request = getRequestConfigByOperationId(swagger, operationId);

  if (!request) {
    return;
  }

  const fileName = operationId;

  if (!isEmpty(request.response)) {
    printFaker(swagger, request.response, fileName);
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

  if (request.method === "post" || request.method === "put" || request.method == "delete") {
    const routePattern = getRoutePath(request.basePath, request.path, request.queryParams);
    const method = toUpper(request.method);
    const temp1 = `
    const { isMatch } = require("../utils");
    const ${fileName} = require("../../.output/${fileName}.json");
    
    module.exports = (req, res, next) => {
      if (req.method === "${method}" && isMatch("${routePattern}")(req.path)) {
        res.status(200).send(${fileName});
        return;
      }
    
      next();
    };
    `;

    const temp2 = `
    const { isMatch } = require("../utils");
    
    module.exports = (req, res, next) => {
      if (req.method === "${method}" && isMatch("${routePattern}")(req.path)) {
        res.status(200).send();
        return;
      }
    
      next();
    };
    `;

    const code = isEmpty(request.response) ? temp2 : temp1;
    fs.writeFileSync(`./${operationId}.js`, prettifyCode(code));
  }
};
