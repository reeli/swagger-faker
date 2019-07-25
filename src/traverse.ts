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

interface ITraverseOptions {
  handleRef: (key: string, data: Schema) => any;
}

export class Traverse {
  static of(definitions: TDefinitions, options?: ITraverseOptions) {
    return new Traverse(definitions, options);
  }

  constructor(private definitions: TDefinitions, private options?: ITraverseOptions) {}

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
    const resolvedProperties: any = {};

    keys(properties).map((name) => {
      if (properties[name].$ref) {
        const refKey = getNameByRef(properties[name].$ref!);

        if (this.options && this.options.handleRef) {
          const data = this.options.handleRef(refKey, properties[name]);
          if (data) {
            resolvedProperties[name] = data;
            return;
          }
        }

        resolvedProperties[name] = this.resolveDefinition(this.definitions[refKey]);
        return;
      }
      if (properties[name].type === "array" && properties[name].items) {
        //TODO: handle the case when items === "array"
        const refKey = getNameByRef((properties[name].items! as any).$ref);

        if (this.options && this.options.handleRef) {
          const data = this.options.handleRef(refKey, properties[name]);
          if (data) {
            resolvedProperties[name] = {
              type: properties[name].type,
              items: data,
            };
            return;
          }
        }

        resolvedProperties[name] = {
          type: properties[name].type,
          items: this.resolveDefinition(this.definitions[refKey]),
        };
        return;
      }
      resolvedProperties[name] = properties[name];
      return;
    });

    return resolvedProperties;
  };
}
