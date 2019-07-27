import * as fs from "fs";
import {getResponseByOperationId, getSpec, printExamples} from "../src";
import program from "commander";

program.option("-o, --operationId <type>", "add operation id").parse(process.argv);

const setMockData = () => {
  if (!program.operationId) {
    throw new Error("Please set an operationId.");
  }
  const spec = getSpec();
  const r: any = getResponseByOperationId(spec, program.operationId);
  if (r) {
    const db = fs.readFileSync("./examples/db.js", "utf-8");
    console.log(db);
    const routes = fs.readFileSync("./examples/routes.json", "utf-8");
    const routesObj = JSON.parse(routes);
    const newRoutes = routesObj[r.path]
      ? routesObj
      : {
          ...routesObj,
          [r.path]: `./${r.response}`,
        };

    printExamples(r.response);

    fs.writeFileSync("./examples/routes.json", JSON.stringify(newRoutes, null, 2));
  }
};

setMockData();
