import path from "path";
import fs from "fs";
import { SwaggerFakerConfig } from "../../__types__/common";

const SWAGGER_FAKER_CONFIG_NAME = "swagger-faker.config.json";
const ERROR_MESSAGES = {
  NOT_FOUND_CONFIG_FILE: `Cannot found config file ${SWAGGER_FAKER_CONFIG_NAME}`,
};

export const DEFAULT_CONFIG = {
  sourcePaths: [""],
  outputFolder: "mock-server",
  timeout: 3 * 60 * 1000,
  port: 8081,
};

export const readSwaggerFakerConfig = (configPath?: string): SwaggerFakerConfig => {
  const codegenConfigPath = configPath || path.resolve(SWAGGER_FAKER_CONFIG_NAME);
  if (!fs.existsSync(codegenConfigPath)) {
    throw new Error(ERROR_MESSAGES.NOT_FOUND_CONFIG_FILE);
  }
  return require(codegenConfigPath);
};
