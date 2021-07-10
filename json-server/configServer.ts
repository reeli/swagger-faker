import * as fs from "fs";
import { isEmpty, map, camelCase } from "lodash";
import { fakerGenFromPath } from "../src";
import { generateMockFile, isJSON } from "../src/utils";
import { FakeGenOutput } from "common";
import { prettifyCode, insertStrToDB } from "./utils";

const mockServerConfig = {
  apiSpecsPaths: ["./data/openapi.json"],
  outputFolder: "mock-server",
};
const dbPath = `${mockServerConfig.outputFolder}/db.js`;
const utilsPath = `${mockServerConfig.outputFolder}/utils.js`;
const mockDataFolder = `${mockServerConfig.outputFolder}/data`;
const middlewaresFolder = `${mockServerConfig.outputFolder}/middlewares`;

const defaultDBStr = `module.exports = () => {
  return {};
};
`;
const utilsStr = `const pathToRegexp = require("path-to-regexp");

const isMatch = (routePattern) => (routePath) => {
  const regexp = pathToRegexp(routePattern);
  return !!regexp.exec(routePath);
};

module.exports = { isMatch };
`;

const bootstrap = () => {
  if (!fs.existsSync(mockServerConfig.outputFolder)) {
    fs.mkdirSync(mockServerConfig.outputFolder, { recursive: true });
  }

  if (!fs.existsSync(middlewaresFolder)) {
    fs.mkdirSync(middlewaresFolder, { recursive: true });
  }

  if (!fs.existsSync(utilsPath)) {
    fs.writeFileSync(utilsPath, utilsStr);
  }

  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, defaultDBStr);
  }

  mockServerConfig.apiSpecsPaths.forEach((apiSpecsPath) => {
    fakerGenFromPath(apiSpecsPath).then((list) => {
      list.map((item) => {
        configJsonServer(item);
      });
    });
  });
};

const configJsonServer = (item: FakeGenOutput) => {
  if (!item) {
    return;
  }

  handleRequest(item, "../utils", "../data", middlewaresFolder);
};

export const writeDB = (operationId: string, mockDataFolderPath: string) => {
  const fileStr = fs.readFileSync(dbPath, "utf-8");
  const result = insertStrToDB(fileStr, operationId, mockDataFolderPath);

  if (result && result.code) {
    const code = prettifyCode(result.code);
    fs.writeFileSync(dbPath, code);
  }
};

const getRoutePath = (path: string, queryParams?: string[]) => {
  const queryList = map(queryParams, (param) => `${param}=:${param}`);
  return !isEmpty(queryParams) ? `${path}?${queryList.join("&")}` : `${path}`;
};

export const writeRoutes = (req: FakeGenOutput, operationId: string, routesPath: string) => {
  const routes = fs.readFileSync(routesPath, "utf-8");
  const routesObj = JSON.parse(routes);
  const newRoutes = routesObj[req.path]
    ? routesObj
    : {
        ...routesObj,
        [getRoutePath(req.path)]: `./${operationId}`,
      };

  fs.writeFileSync(routesPath, JSON.stringify(newRoutes, null, 2));
};

const handleRequest = (item: FakeGenOutput, utilsPath: string, mockDataPath: string, middlewarePath: string) => {
  const routePattern = getRoutePath(item.path);
  const operationId = camelCase(item.operationId);

  if (!operationId) {
    return;
  }

  const resWithMockData = `
    const { isMatch } = require("${utilsPath}");
    const ${operationId} = require("${mockDataPath}/${operationId}.json");

    module.exports = (req, res, next) => {
      if (req.method === "${item.method}" && isMatch("${routePattern}")(req.path)) {
        res.status(200).send(${operationId});
        return;
      }

      next();
    };
    `;

  const resWithoutMockData = `
    const { isMatch } = require("${utilsPath}");

    module.exports = (req, res, next) => {
      if (req.method === "${item.method}" && isMatch("${routePattern}")(req.path)) {
        res.status(200).send();
        return;
      }

      next();
    };
    `;

  const code = item.mocks && isJSON(item.mocks) ? resWithMockData : resWithoutMockData;

  generateMockFile(item.mocks, operationId, mockDataFolder);
  fs.writeFileSync(`${middlewarePath}/${operationId}.js`, prettifyCode(code));
};

bootstrap();
