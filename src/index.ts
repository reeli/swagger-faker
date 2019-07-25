import * as fs from "fs";
import { Schema, Spec } from "swagger-schema-official";
import program from "commander";
import { keys } from "lodash";

const getNameByRef = (str: string) => {
  if (!str) {
    return "";
  }
  const list = str.split("/");
  return list[list.length - 1];
};

program.option("-o, --operationId <type>", "add operation id").parse(process.argv);

if (program.operationId) {
  printExamples(program.operationId);
} else {
  throw new Error("You must input an operationId to generate its examples.");
}

function printExamples(operationId: string) {
  console.log(operationId);
  const schemaStr = fs.readFileSync("./__swagger__/swagger.json", "utf8");
  const schema = JSON.parse(schemaStr) as Spec;
  if (schema.definitions) {
    const data = resolveDefinitions(schema.definitions);
    fs.writeFileSync("./test.json", JSON.stringify(data, null, 2), "utf-8");
  }
}

function resolveProperties(
  properties: { [propertyName: string]: Schema },
  definitions: { [definitionsName: string]: Schema },
  parentName: string,
) {
  const results: any = {};

  keys(properties).map((name) => {
    if (properties[name].$ref) {
      const key = getNameByRef(properties[name].$ref!);
      if (parentName === key) {
        // console.log(key,'xx')
        // results[name] = properties[name];
        return;
      }

      // console.log(_definitions[key])

      results[name] = resolveDefinition(definitions[key], definitions, key);
      return;
    }
    if (properties[name].type === "array" && properties[name].items) {
      const itemKey = getNameByRef((properties[name].items! as any).$ref);
      if (parentName === itemKey) {
        console.log(itemKey, "item");
        // results[name] = properties[name];
        return;
      }
      results[name] = {
        type: properties[name].type,
        items: resolveDefinition(definitions[itemKey], definitions, name),
      };
      return;
    }
    results[name] = properties[name];
    return;
  });
  return results;
}

function resolveDefinition(
  definition: Schema = {},
  definitions: { [definitionsName: string]: Schema },
  parentName: string,
) {
  if (definition.properties) {
    return {
      ...definition,
      properties: resolveProperties(definition.properties!, definitions, parentName),
    };
  }
  return definition;
}

function resolveDefinitions(definitions: { [definitionsName: string]: Schema }) {
  const results: any = {};
  keys(definitions).map((name) => {
    results[name] = resolveDefinition(definitions[name], definitions, name);
  });
  return results;
}

export enum SwaggerDataTypes {
  string = "string",
  number = "number",
  integer = "integer",
  boolean = "boolean",
  array = "array",
  object = "object",
  file = "file",
}

// TODO: handle number maximal and minimal
