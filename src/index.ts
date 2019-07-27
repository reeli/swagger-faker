import * as fs from "fs";
import { Spec } from "swagger-schema-official";
import { Traverse } from "./traverse";
import { getAllFaker, getFaker } from "./faker";
import { forEach, get, pick } from "lodash";
import { pickRefKey } from "./utils";

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
      console.log(getResponseByOperationId(schema, operationId));
      fs.writeFileSync(`./.output/${operationId}.json`, JSON.stringify(getFaker(data[operationId]), null, 2), "utf-8");
    } else {
      fs.writeFileSync(`./.output/mock-data.json`, JSON.stringify(getAllFaker(data), null, 2), "utf-8");
    }
  }
}

const getResponseByOperationId = (spec: Spec, operationId: string) => {
  let res = null;
  forEach(spec.paths, (path, pathName) => {
    const operations = pick(path, ["get", "post", "put", "delete", "patch", "options", "head"]);
    Object.keys(operations).map((method) => {
      // TODO: remove any
      if ((path as any)[method].operationId === operationId) {
        const p = pathName.replace(/\{/g, ":").replace(/\}/g, "");
        res = {
          path: spec.basePath ? `${spec.basePath}${p}` : p,
          method,
          responses: pickRefKey(get((path as any)[method], "responses.200.schema.$ref")),
        };
      }
    });
  });
  return res;
};
