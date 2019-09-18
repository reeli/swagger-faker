import prettier from "prettier";
import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import * as t from "@babel/types";
import { transformFromAstSync } from "@babel/core";

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
