import { Schema } from "swagger-schema-official";
import { keys } from "lodash";

const getNameByRef = (str: string) => {
  if (!str) {
    return "";
  }
  const list = str.split("/");
  return list[list.length - 1];
};

function resolveProperties(
  properties: { [propertyName: string]: Schema },
  definitions: { [definitionsName: string]: Schema },
) {
  const results: any = {};

  keys(properties).map((name) => {
    if (properties[name].$ref) {
      const key = getNameByRef(properties[name].$ref!);
      if (key === "File") {
        return;
      }

      results[name] = resolveDefinition(definitions[key], definitions);
      return;
    }
    if (properties[name].type === "array" && properties[name].items) {
      const itemKey = getNameByRef((properties[name].items! as any).$ref);

      if (itemKey === "File") {
        return;
      }
      results[name] = {
        type: properties[name].type,
        items: resolveDefinition(definitions[itemKey], definitions),
      };
      return;
    }
    results[name] = properties[name];
    return;
  });
  return results;
}

function resolveDefinition(definition: Schema = {}, definitions: { [definitionsName: string]: Schema }) {
  if (definition.properties) {
    return {
      ...definition,
      properties: resolveProperties(definition.properties!, definitions),
    };
  }
  return definition;
}

export function resolveDefinitions(definitions: { [definitionsName: string]: Schema }) {
  const results: any = {};
  keys(definitions).map((name) => {
    results[name] = resolveDefinition(definitions[name], definitions);
  });
  return results;
}
