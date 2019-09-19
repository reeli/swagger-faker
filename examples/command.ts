import program from "commander";
import * as fs from "fs";
import { Spec } from "swagger-schema-official";
import { configMockServer } from "./fakerGen";

program.option("-o, --operationId <type>", "operation id").parse(process.argv);

if (!program.operationId) {
  throw new Error("Please set an operationId!");
}

const schemaStr = fs.readFileSync("./examples/swagger.json", "utf8");
const finalSchemaStr = schemaStr.replace(/#\/definitions\/File/gi, "");
const swagger = JSON.parse(finalSchemaStr) as Spec;

configMockServer(swagger, program.operationId);
