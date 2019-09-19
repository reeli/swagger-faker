import { Schema } from "swagger-schema-official";
import { Traverse } from "./traverse";
import { toFaker } from "./faker";

export function getFakerByDefinitions(definitions: { [definitionsName: string]: Schema }) {
  if (definitions) {
    const data = Traverse.of(definitions).traverse();
    return toFaker(data);
  }
  console.error("You must input definitions!");
  return {};
}
