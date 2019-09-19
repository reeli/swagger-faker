import * as fs from "fs";
import { Spec } from "swagger-schema-official";
import { getRequestByOperationId, IRequest } from "../src";
import { printFaker } from "../src/printer";
import { getInsertFileStr, prettifyCode } from "./utils";
import { isEmpty, map ,toUpper} from "lodash";

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

export const configMockServer = (swagger: Spec, operationId: string) => {
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

  if (request.method === "post" || request.method === "put" || request.method == "delete") {
    const routePattern = getRoutePath(request.basePath, request.path, request.queryParams);
    const method = toUpper(request.method);
    const temp1 = `
    const { isMatch } = require("../utils");
    const SupervisorNoteVO = require("../../.output/${request.response}.json");
    
    module.exports = (req, res, next) => {
      if (req.method === "${method}" && isMatch("${routePattern}")(req.path)) {
        res.status(200).send(${request.response});
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

    const code = request.response ? temp1 : temp2;

    fs.writeFileSync(`./${operationId}.js`, prettifyCode(code));
  }
};
