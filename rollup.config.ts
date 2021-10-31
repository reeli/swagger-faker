import path from "path";
import rollupTypeScript from "@rollup/plugin-typescript";

const pkg = require(path.join(__dirname, "package.json"));

module.exports = {
  input: "src/cli/index.ts",
  output: [
    {
      file: pkg.main,
      format: "cjs",
    },
    {
      file: pkg.module,
      format: "es",
    },
  ],
  external: [
    // @ts-ignore
    ...Object.keys(process.binding("natives")),
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
  ],
  plugins: [rollupTypeScript({ target: "es5", module: "es6" })],
};
