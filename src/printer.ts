import { Spec } from "swagger-schema-official";
import { Traverse } from "./traverse";
import * as fs from "fs";
import { toFaker } from "./faker";

export function printFaker(spec: Spec, definitionName?: string, outputFolderName = ".output") {
  if (spec.definitions) {
    const data = Traverse.of(spec.definitions).traverse();

    if (!fs.existsSync(outputFolderName)) {
      fs.mkdirSync(outputFolderName);
    }

    const faker = toFaker(data);
    if (definitionName) {
      fs.writeFileSync(
        `${outputFolderName}/${definitionName}.json`,
        JSON.stringify(faker[definitionName], null, 2),
        "utf-8",
      );
    } else {
      fs.writeFileSync(`${outputFolderName}/${spec.basePath}.json`, JSON.stringify(faker, null, 2), "utf-8");
    }
  }
}
