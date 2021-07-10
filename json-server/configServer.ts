import * as fs from "fs";
import { isEmpty, map, toUpper } from "lodash";
import { getInsertFileStr, prettifyCode } from "./utils";
import { fakerGenFromPath } from "../src";
import {generateMockFile} from "../src/utils";

const path = "/Users/rrli/tw/gitRepo/swagger-faker/examples/swagger.json";
const mockServerConfig = {
  db: "/Users/rrli/tw/gitRepo/swagger-faker/examples/mock-server-config/db.js",
  routes: "/Users/rrli/tw/gitRepo/swagger-faker/examples/mock-server-config/routes.json",
};

const getRoutePath = (path: string, queryParams?: string[]) => {
  const queryList = map(queryParams, (param) => `${param}=:${param}`);
  return !isEmpty(queryParams) ? `${path}?${queryList.join("&")}` : `${path}`;
};

const writeRoutes = (req: any, operationId: string) => {
  const routes = fs.readFileSync(mockServerConfig.routes, "utf-8");
  const routesObj = JSON.parse(routes);
  const newRoutes = routesObj[req.path]
    ? routesObj
    : {
        ...routesObj,
        [getRoutePath(req.path)]: `./${operationId}`,
      };

  fs.writeFileSync(mockServerConfig.routes, JSON.stringify(newRoutes, null, 2));
};

const configJsonServer = (request: any) => {
  if (!request) {
    return;
  }

  const operationId = request.operationId;

  if (request.method === "GET") {
    const fileStr = fs.readFileSync(mockServerConfig.db, "utf-8");
    const result = getInsertFileStr(fileStr, operationId);

    writeRoutes(request, operationId);

    if (result && result.code) {
      const code = prettifyCode(result.code);
      fs.writeFileSync(mockServerConfig.db, code);
    }
  }

  if (request.method === "POST" || request.method === "PUT" || request.method == "DELETE") {
    const routePattern = getRoutePath(request.path);
    const method = toUpper(request.method);
    const temp1 = `
    const { isMatch } = require("../utils");
    const ${operationId} = require("../../.output/${operationId}.json");
    
    module.exports = (req, res, next) => {
      if (req.method === "${method}" && isMatch("${routePattern}")(req.path)) {
        res.status(200).send(${operationId});
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

fakerGenFromPath(path).then((list: any) => {
  list.map((item: any) => {
    if (item.mocks) {
      generateMockFile(item.mocks, item.operationId);
    }

    configJsonServer(item);
  });
});
