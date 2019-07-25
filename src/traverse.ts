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

      console.log(key,name)

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

export function resolveDefinitions(definitions: { [definitionsName: string]: Schema }) {
  const results: any = {};
  keys(definitions).map((name) => {
    results[name] = resolveDefinition(definitions[name], definitions, name);
  });
  return results;
}
