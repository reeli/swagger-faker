import * as fs from "fs";
import { Spec } from "swagger-schema-official";
import { Traverse } from "./traverse";
import { getFaker } from "./faker";

printExamples();

function printExamples() {
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
    fs.writeFileSync(
      `./.output/UpdateProfileRequest.json`,
      JSON.stringify(getFaker(data.UpdateProfileRequest), null, 2),
      "utf-8",
    );
  }
}
