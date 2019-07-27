import { Schema } from "swagger-schema-official";
import { mapValues } from "lodash";
import { pickRefKey } from "./utils";

type TDefinitions = { [definitionsName: string]: Schema };
type TProperties = { [propertyName: string]: Schema };

interface ITraverseOptions {
  resolveRef: (next: () => Schema) => (refKey: string, property: Schema) => any;
}

export class Traverse {
  static of(definitions: TDefinitions, options?: ITraverseOptions) {
    return new Traverse(definitions, options);
  }

  constructor(private definitions: TDefinitions, private options?: ITraverseOptions) {}

  traverse = () => mapValues(this.definitions, (definition) => this.resolveDefinition(definition));

  resolveDefinition = (definition: Schema = {}): any => {
    // TODO: handle definition.additionalProperties
    if (definition.properties) {
      return {
        ...definition,
        properties: this.replaceRefInProperties(definition.properties!),
      };
    }
    return definition;
  };

  replaceRefInProperties = (properties: TProperties) =>
    mapValues(properties, (property) => {
      if (property.$ref) {
        return this.handleRef(property);
      }
      if (property.type === "array" && property.items) {
        return this.handleItems(property);
      }
      return property;
    });

  handleRef = (property: Schema) => {
    const refKey = pickRefKey(property.$ref!);
    const next = () => {
      return this.resolveDefinition(this.definitions[refKey]);
    };
    if (this.options && this.options.resolveRef) {
      return this.options.resolveRef(next)(refKey, property);
    }

    return next();
  };

  handleItems = (property: Schema) => {
    //TODO: handle the case when items === "array"
    const refKey = pickRefKey((property.items! as any).$ref);

    const next = () => ({
      type: property.type,
      items: this.resolveDefinition(this.definitions[refKey]),
    });

    if (this.options && this.options.resolveRef) {
      const items = this.options.resolveRef(next)(refKey, property);

      return {
        ...property,
        items,
      };
    }

    return next();
  };
}
