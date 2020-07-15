import { Schema } from "swagger-schema-official";
import { Dictionary, isArray, map, mapValues } from "lodash";
import { pickRefKey } from "./utils";

type TDefinitions = { [definitionsName: string]: Schema };

type TResolvedSchema = Omit<Schema, "properties"> & { properties: Dictionary<any> };

export class Traverse {
  static of(definitions: TDefinitions) {
    return new Traverse(definitions);
  }

  constructor(private definitions: TDefinitions) {}

  traverse = () => mapValues(this.definitions, (definition) => this.resolveDefinition(definition));

  traverseSpecificDefinition = (specificDefinitionName: string) =>
    this.resolveDefinition(this.definitions[specificDefinitionName]);

  resolveDefinition = (definition: Schema = {}): Schema | TResolvedSchema => {
    if (definition.properties) {
      return {
        ...definition,
        properties: mapValues<Schema>(definition.properties, (schema: Schema) => this.handleRef(schema)),
      };
    }

    if (definition.additionalProperties) {
      return {
        ...definition,
        properties: this.handleRef(definition.additionalProperties as Schema),
      };
    }

    return definition;
  };

  handleRef = (schema: Schema) => {
    if (schema.$ref) {
      return this.replaceRefInSchema(schema);
    }

    if (schema.type === "array") {
      return {
        ...schema,
        items: this.replaceRefInItems(schema.items!),
      };
    }

    return schema;
  };

  replaceRefInSchema = (schema: Schema) => {
    const refKey = pickRefKey(schema.$ref!);
    return this.resolveDefinition(this.definitions[refKey]);
  };

  replaceRefInItems = (items: Schema | Schema[]): Schema | Schema[] => {
    if (isArray(items)) {
      return map(items, (item) => {
        const refKey = pickRefKey(item.$ref);
        return refKey ? this.resolveDefinition(this.definitions[refKey]) : item;
      });
    }

    if (items.items) {
      return {
        ...items,
        items: this.replaceRefInItems(items.items),
      };
    }

    const refKey = pickRefKey(items.$ref);
    return refKey ? this.resolveDefinition(this.definitions[refKey]) : items;
  };
}
