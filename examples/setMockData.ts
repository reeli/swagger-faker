import * as fs from "fs";
import { getResponseByOperationId, getSpec, printExamples } from "../src";
import program from "commander";
import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import { transformFromAstSync } from "@babel/core";
import * as t from "@babel/types";

program.option("-o, --operationId <type>", "add operation id").parse(process.argv);

// TODO: handle the case when db.js file is empty

function handleDB(propName: string) {
  const db = fs.readFileSync("./examples/db.js", "utf-8");
  const ast = parse(db, {
    sourceType: "module",
  });

  let lastImport: any;
  let isExists: boolean = false;
  traverse(ast, {
    VariableDeclaration: (path) => {
      path.node.declarations.map((node) => {
        if ((node.id as any).name === propName) {
          isExists = true;
        }
      });

      lastImport = path;
    },
    ObjectExpression: ({ node }) => {
      node.properties.push(t.objectProperty(t.identifier(propName), t.identifier(propName), undefined, true));
    },
  });

  if (isExists) {
    console.log("Already exists!");
    return;
  }

  const code = `const ${propName} = require("./${propName}.json");`;
  lastImport && lastImport.insertAfter(parse(code, { sourceType: "module" }));

  const result = transformFromAstSync(ast);

  if (result) {
    console.log(result.code);
    fs.writeFileSync("./examples/db.js", result.code);
  }
}

const setMockData = () => {
  if (!program.operationId) {
    throw new Error("Please set an operationId.");
  }
  const spec = getSpec();
  const r: any = getResponseByOperationId(spec, program.operationId);
  if (r) {
    const writeRoutes = () => {
      const routes = fs.readFileSync("./examples/routes.json", "utf-8");
      const routesObj = JSON.parse(routes);
      const newRoutes = routesObj[r.path]
        ? routesObj
        : {
            ...routesObj,
            [r.path]: `./${r.operationId}`,
          };

      fs.writeFileSync("./examples/routes.json", JSON.stringify(newRoutes, null, 2));
    };

    if (r.method === "get") {
      handleDB(r.operationId);

      writeRoutes();
      printExamples(r.responses["200"]);
    }

    if (r.method === "post") {
      if (r.responses["201"]) {
        console.warn("Do not support a post request till now!");
        // writeRoutes();
        // printExamples(r.responses["201"]);
        // console.log(r);
      }
    }
  }
};

setMockData();
