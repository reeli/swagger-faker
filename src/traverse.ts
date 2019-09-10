import { Schema } from "swagger-schema-official";
import { Dictionary, isArray, mapValues } from "lodash";
import { pickRefKey } from "./utils";

type TDefinitions = { [definitionsName: string]: Schema };
type TProperties = { [propertyName: string]: Schema };

type TResolvedSchema = Omit<Schema, "properties"> & { properties: Dictionary<any> };

interface ITraverseOptions {
  resolveRef: (next: () => Schema | TResolvedSchema) => (refKey: string, property: Schema) => any;
}

export class Traverse {
  static of(definitions: TDefinitions, options?: ITraverseOptions) {
    return new Traverse(definitions, options);
  }

  constructor(private definitions: TDefinitions, private options?: ITraverseOptions) {}

  traverse = () => mapValues(this.definitions, (definition) => this.resolveDefinition(definition));

  resolveDefinition = (definition: Schema = {}): Schema | TResolvedSchema => {
    // TODO: handle definition.additionalProperties
    if (definition.properties) {
      return {
        ...definition,
        properties: this.replaceRef(definition.properties!),
      };
    }
    return definition;
  };

  replaceRef = (properties: TProperties) =>
    mapValues<Schema>(properties, (property: Schema) => {
      if (property.$ref) {
        return this.handleRef(property);
      }

      if (property.type === "array") {
        return this.handleArray(property);
      }

      return property;
    });

  handleRef = (property: Schema) => {
    const refKey = pickRefKey(property.$ref!);
    const next = () => this.resolveDefinition(this.definitions[refKey]);
    if (this.options && this.options.resolveRef) {
      return this.options.resolveRef(next)(refKey, property);
    }

    return next();
  };

  handleArray = (property: Schema) => {
    if (property.items) {
      if (isArray(property.items)) {
        return {
          ...property,
          items: this.handleArrayItems(property.items),
        };
      }

      return {
        ...property,
        items: this.handleItems(property.items),
      };
    }
  };

  // TODO: handle the case when items === "array"
  handleArrayItems = (_: Schema[]) => {};

  handleItems = (items: Schema) => {
    // TODO: handle items.$ref

    if (!items.$ref) {
      return;
    }

    const refKey = pickRefKey(items.$ref);
    const next = () => this.resolveDefinition(this.definitions[refKey]);

    if (this.options && this.options.resolveRef) {
      return this.options.resolveRef(next)(refKey, items);
    }

    return next();
  };
}
