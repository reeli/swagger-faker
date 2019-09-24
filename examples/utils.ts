import prettier from "prettier";
import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import * as t from "@babel/types";
import { transformFromAstSync } from "@babel/core";
import pathToRegexp from "path-to-regexp";
import { Spec } from "swagger-schema-official";
import { IResponse, toFaker, Traverse } from "../src";
import * as fs from "fs";
import { booleanGenerator, numberGenerator, stringGenerator } from "../src/generators";
import { uniqueId } from "lodash";

export const prettifyCode = (code: string) =>
  prettier.format(code, {
    printWidth: 120,
    trailingComma: "all",
    arrowParens: "always",
    parser: "typescript",
  });

export const getInsertFileStr = (fileStr: string, propName: string) => {
  let lastImport: any;
  let isExists: boolean = false;

  const ast = parse(fileStr, {
    sourceType: "module",
  });

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
    console.log(`${propName} already exists in your mock server file!`);
    return;
  }

  if (lastImport) {
    lastImport.insertAfter(parse(`const ${propName} = require("./${propName}.json");`, { sourceType: "module" }));
  }

  return transformFromAstSync(ast, undefined, { compact: true });
};

export const isMatch = (routePattern: string) => (routePath: string) => {
  const regexp = pathToRegexp(routePattern);
  return !!regexp.exec(routePath);
};

const getFakeData = (spec: Spec, response: IResponse) => {
  if (response.examples) {
    return response.examples;
  }

  if (!spec.definitions) {
    return {};
  }

  if (response.schema.refKey && !response.schema.type) {
    const data = Traverse.of(spec.definitions).traverse();
    return toFaker(data)[response.schema.refKey];
  }

  switch (response.schema.type) {
    case "array":
      const data = Traverse.of(spec.definitions).traverse();
      return [toFaker(data)[response.schema.refKey!]];
    case "object":
      return {};
    case "string":
      return stringGenerator();
    case "boolean":
      return booleanGenerator();
    case "integer":
    case "number":
      return numberGenerator();
    default:
      return {};
  }
};

export function printFaker(spec: Spec, response: IResponse, outputFolderName = ".output") {
  if (spec.definitions) {
    const fakeData = getFakeData(spec, response);

    if (!fs.existsSync(outputFolderName)) {
      fs.mkdirSync(outputFolderName);
    }

    if (response.schema.refKey) {
      fs.writeFileSync(
        `${outputFolderName}/${response.schema.refKey}.json`,
        JSON.stringify(fakeData, null, 2),
        "utf-8",
      );
    } else {
      fs.writeFileSync(`${uniqueId("response")}.json`, JSON.stringify(fakeData, null, 2), "utf-8");
    }
  }
}
