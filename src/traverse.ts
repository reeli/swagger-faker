import { Schema } from "swagger-schema-official";
import { Dictionary, isArray, mapValues } from "lodash";
import { pickRefKey } from "./utils";

type TDefinitions = { [definitionsName: string]: Schema };

type TResolvedSchema = Omit<Schema, "properties"> & { properties: Dictionary<any> };

export class Traverse {
  static of(definitions: TDefinitions) {
    return new Traverse(definitions);
  }

  constructor(private definitions: TDefinitions) {}

  traverse = () => mapValues(this.definitions, (definition) => this.resolveDefinition(definition));

  resolveDefinition = (definition: Schema = {}): Schema | TResolvedSchema => {
    if (definition.properties) {
      return {
        ...definition,
        properties: mapValues<Schema>(definition.properties, (property: Schema) => this.replaceRef(property)),
      };
    }

    if (definition.additionalProperties) {
      return {
        ...definition,
        properties: this.replaceRef(definition.additionalProperties),
      };
    }

    return definition;
  };

  replaceRef = (property: Schema) => {
    if (property.$ref) {
      return this.handleRef(property);
    }

    if (property.type === "array") {
      return {
        ...property,
        items: this.handleItems(property.items!),
      };
    }

    return property;
  };

  handleRef = (property: Schema) => {
    const refKey = pickRefKey(property.$ref!);
    return this.resolveDefinition(this.definitions[refKey]);
  };

  handleItems = (items: Schema | Schema[]): Schema => {
    if (isArray(items)) {
      // TODO: handle the case when items === "array"
      return {};
    }

    if (items.items) {
      return {
        ...items,
        items: this.handleItems(items.items),
      };
    }

    const refKey = pickRefKey(items.$ref);
    return refKey ? this.resolveDefinition(this.definitions[refKey]) : items;
  };
}
