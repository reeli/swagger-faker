import * as fs from "fs";
import { Spec } from "swagger-schema-official";
import program from "commander";
import { Traverse } from "./traverse";

program.option("-o, --operationId <type>", "add operation id").parse(process.argv);

if (program.operationId) {
  printExamples(program.operationId);
} else {
  throw new Error("You must input an operationId to generate its examples.");
}

function printExamples(operationId: string) {
  console.log(operationId);
  const schemaStr = fs.readFileSync("./__swagger__/swagger.json", "utf8");
  const schema = JSON.parse(schemaStr) as Spec;
  if (schema.definitions) {
    const data = Traverse.of(schema.definitions, {
      handleRef: (key) => {
        if (key === "File") {
          return "string";
        }
      },
    }).traverse();

    if (!fs.existsSync(".output")) {
      fs.mkdirSync(".output");
    }

    fs.writeFileSync("./.output/test.json", JSON.stringify(data, null, 2), "utf-8");
  }
}

export enum SwaggerDataTypes {
  string = "string",
  number = "number",
  integer = "integer",
  boolean = "boolean",
  array = "array",
  object = "object",
  file = "file",
}

// TODO: handle number maximal and minimal
