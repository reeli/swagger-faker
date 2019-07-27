import program from "commander";

program.option("-o, --operationId <type>", "add operation id").parse(process.argv);

if (program.operationId) {
} else {
  throw new Error("You must input an operationId to generate its examples.");
}
