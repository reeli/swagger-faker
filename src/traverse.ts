import { Schema } from "swagger-schema-official";
import { keys } from "lodash";

const getNameByRef = (str: string) => {
  if (!str) {
    return "";
  }
  const list = str.split("/");
  return list[list.length - 1];
};

type TDefinitions = { [definitionsName: string]: Schema };

export class Traverse {
  static of(definitions: TDefinitions) {
    return new Traverse(definitions);
  }

  constructor(private definitions: TDefinitions) {}

  traverse = () => {
    const results: TDefinitions = {};
    keys(this.definitions).map((name) => {
      results[name] = this.resolveDefinition(this.definitions[name]);
    });
    return results;
  };

  resolveDefinition = (definition: Schema = {}) => {
    if (definition.properties) {
      return {
        ...definition,
        properties: this.resolveProperties(definition.properties!),
      };
    }
    return definition;
  };

  resolveProperties = (properties: { [propertyName: string]: Schema }) => {
    const results: any = {};

    keys(properties).map((name) => {
      if (properties[name].$ref) {
        const key = getNameByRef(properties[name].$ref!);
        if (key === "File") {
          return;
        }

        results[name] = this.resolveDefinition(this.definitions[key]);
        return;
      }
      if (properties[name].type === "array" && properties[name].items) {
        const itemKey = getNameByRef((properties[name].items! as any).$ref);

        if (itemKey === "File") {
          return;
        }
        results[name] = {
          type: properties[name].type,
          items: this.resolveDefinition(this.definitions[itemKey]),
        };
        return;
      }
      results[name] = properties[name];
      return;
    });
    return results;
  };
}
