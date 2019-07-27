import program from "commander";
import { printExamples } from "./index";

program.option("-o, --operationId <type>", "add operation id").parse(process.argv);

printExamples(program.operationId);
