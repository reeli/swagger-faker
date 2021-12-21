import prettier from "prettier";
import { pathToRegexp } from "path-to-regexp";

export const prettifyCode = (code: string) =>
  prettier.format(code, {
    printWidth: 120,
    trailingComma: "all",
    arrowParens: "always",
    parser: "babel",
  });

export const isMatch = (routePattern: string) => (routePath: string) => {
  const regexp = pathToRegexp(routePattern);
  return !!regexp.exec(routePath);
};
