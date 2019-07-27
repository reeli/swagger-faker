import * as fs from "fs";
import { Spec } from "swagger-schema-official";
import { Traverse } from "./traverse";
import { getAllFaker, getFaker } from "./faker";

export function printExamples(operationId?: string) {
  const schemaStr = fs.readFileSync("./examples/swagger.json", "utf8");
  const schema = JSON.parse(schemaStr) as Spec;
  if (schema.definitions) {
    const data = Traverse.of(schema.definitions, {
      resolveRef: (next) => (refKey) => {
        if (refKey === "File") {
          return "string";
        }
        return next();
      },
    }).traverse();

    if (!fs.existsSync(".output")) {
      fs.mkdirSync(".output");
    }

    fs.writeFileSync("./.output/test.json", JSON.stringify(data, null, 2), "utf-8");

    if (operationId) {
      fs.writeFileSync(`./.output/${operationId}.json`, JSON.stringify(getFaker(data[operationId]), null, 2), "utf-8");
    } else {
      fs.writeFileSync(`./.output/mock-data.json`, JSON.stringify(getAllFaker(data), null, 2), "utf-8");
    }
  }
}
