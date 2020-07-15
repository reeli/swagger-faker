import { Reference, Response, Schema, Spec } from "swagger-schema-official";
import { get, isArray, map, mapValues } from "lodash";
import {
  booleanGenerator,
  fileGenerator,
  numberGenerator,
  stringGenerator,
  dateGenerator,
  timeGenerator,
  dateTimeGenerator,
  urlGenerator,
} from "./generators";
import { pickRefKey } from "./utils";
import { Traverse } from "./traverse";

type TParameterType = "string" | "number" | "integer" | "boolean" | "array" | "object" | "file";

export const toFaker = (data: { [definitionsName: string]: Omit<Schema, "$ref"> }) =>
  mapValues(data, (item) => toFakeObj(item));

export const toFakeObj = (schema: Schema = {}): any => {
  let results = {};
  const getFakeProperties = (properties: Schema) => {
    return mapValues(properties, (property) => {
      switch (property.type) {
        case "object":
          return toFakeObj(property);
        case "array":
          return toFakeItems(property, property.example);
        default:
          return toFakeProp(property);
      }
    });
  };

  if (schema.properties) {
    results = {
      ...results,
      ...getFakeProperties(schema.properties),
    };
  }

  if (schema.additionalProperties) {
    results = {
      ...results,
      ...getFakeProperties(schema.additionalProperties),
    };
  }

  return results;
};

export const toFakeItems = (items: Schema | Schema[], example?: any): any[] => {
  if (example) {
    return example;
  }

  if (isArray(items)) {
    return map(items, (item) => toFakeProp(item));
  }

  if (items.items) {
    return isArray(items.items) ? toFakeItems(items.items, items.example) : [toFakeItems(items.items, items.example)];
  }

  if (items.type === "object") {
    return toFakeObj(items);
  }

  return toFakeProp({
    type: items.type,
    items,
    example,
  });
};

const toFakeProp = (schema: Schema) => {
  if (schema.example) {
    return schema.example;
  }

  switch (schema.type as TParameterType) {
    case "boolean":
      return booleanGenerator();
    case "string":
      if (schema.format === "date") {
        return dateGenerator();
      } else if (schema.format === "time") {
        return timeGenerator();
      } else if (schema.format === "date-time") {
        return dateTimeGenerator();
      } else if (schema.format === "uri") {
        return urlGenerator();
      }
      return stringGenerator(schema.enum);
    case "number":
    case "integer":
      return numberGenerator(schema.maximum, schema.minimum);
    case "file":
      return fileGenerator();
    default:
      return "";
  }
};

export const getFakeData = (spec: Spec, response: Response | Reference) => {
  const $ref = get(response, "$ref");
  if ($ref && spec.definitions) {
    const refKey = pickRefKey($ref);
    return toFakeObj(spec.definitions[refKey]);
  }

  if (!response) {
    return {};
  }

  const { examples, schema } = response as Response;

  if (examples) {
    return examples;
  }

  if (!spec.definitions || !schema) {
    return {};
  }

  const schemaWithoutRef = Traverse.of(spec.definitions).handleRef(schema);

  switch (schemaWithoutRef.type) {
    case "array":
      return schemaWithoutRef.items ? toFakeItems(schemaWithoutRef) : {};
    case "object":
      return toFakeObj(schemaWithoutRef);
    case "string":
      return stringGenerator();
    case "boolean":
      return booleanGenerator();
    case "number":
    case "integer":
      return numberGenerator();
    default:
      return {};
  }
};
