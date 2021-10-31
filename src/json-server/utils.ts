import prettier from "prettier";
import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import * as t from "@babel/types";
import { transformFromAstSync } from "@babel/core";
import { pathToRegexp } from "path-to-regexp";

export const prettifyCode = (code: string) =>
  prettier.format(code, {
    printWidth: 120,
    trailingComma: "all",
    arrowParens: "always",
    parser: "babel",
  });

export const insertStrToDB = (fileStr: string, propName: string, mockDataFolderPath: string) => {
  let beforeReturn: any;
  let isExists: boolean = false;

  const ast = parse(fileStr, { sourceType: "module" });
  traverse(ast, {
    ReturnStatement: (path) => {
      beforeReturn = path;
    },
    VariableDeclaration: (path) => {
      path.node.declarations.map((node) => {
        if ((node.id as any).name === propName) {
          isExists = true;
        }
      });
    },
    ObjectExpression: ({ node }) => {
      node.properties.push(t.objectProperty(t.identifier(propName), t.identifier(propName), undefined, true));
    },
  });

  if (isExists) {
    console.log(`${propName} already exists in your mock server file!`);
    return;
  }

  if (beforeReturn) {
    beforeReturn.insertBefore(
      parse(`const ${propName} = require("${mockDataFolderPath}/${propName}.json");`, { sourceType: "module" }),
    );
  }

  return transformFromAstSync(ast, undefined, { compact: true });
};

export const isMatch = (routePattern: string) => (routePath: string) => {
  const regexp = pathToRegexp(routePattern);
  return !!regexp.exec(routePath);
};
