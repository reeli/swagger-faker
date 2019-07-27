import { Schema } from "swagger-schema-official";
import { mapValues } from "lodash";
import { pickRefKey } from "./utils";

type TDefinitions = { [definitionsName: string]: Schema };
type TProperties = { [propertyName: string]: Schema };

interface ITraverseOptions {
  handleRef: (
    data: {
      refKey: string;
      property: Schema;
    },
    next: () => any,
  ) => any;
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
        const refKey = pickRefKey(property.$ref!);
        const next = () => {
          return this.resolveDefinition(this.definitions[refKey]);
        };
        if (this.options && this.options.handleRef) {
          return this.options.handleRef(
            {
              refKey,
              property,
            },
            next,
          );
        }

        return next();
      }
      if (property.type === "array" && property.items) {
        //TODO: handle the case when items === "array"
        const refKey = pickRefKey((property.items! as any).$ref);

        const next = () => ({
          type: property.type,
          items: this.resolveDefinition(this.definitions[refKey]),
        });

        if (this.options && this.options.handleRef) {
          const items = this.options.handleRef(
            {
              refKey,
              property,
            },
            next,
          );

          return {
            ...property,
            items,
          };
        }

        return next();
      }
      return property;
    });
}
