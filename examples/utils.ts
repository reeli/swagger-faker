import prettier from "prettier";
import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import * as t from "@babel/types";
import { transformFromAstSync } from "@babel/core";
import pathToRegexp from "path-to-regexp";
import { Spec } from "swagger-schema-official";
import { Traverse } from "../src/traverse";
import * as fs from "fs";
import { toFaker } from "../src/faker";

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
