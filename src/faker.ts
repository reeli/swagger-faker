import { Schema } from "swagger-schema-official";
import { isArray, isEmpty, map, mapValues } from "lodash";
import { booleanGenerator, fileGenerator, numberGenerator, stringGenerator } from "./generators";

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
          return toFakeProp(property, property.example);
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

const toFakeItems = (items: Schema | Schema[], example?: any): any[] => {
  if (example) {
    return example;
  }

  if (isEmpty(items)) {
    return [];
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

  return [toFakeProp(items)];
};

const toFakeProp = (item: Schema, example?: any) => {
  if (example) {
    return example;
  }

  switch (item.type as TParameterType) {
    case "boolean":
      return booleanGenerator();
    case "string":
      return stringGenerator(item.enum);
    case "number":
    case "integer":
      return numberGenerator(item.maximum, item.minimum);
    case "file":
      return fileGenerator();
    default:
      return "";
  }
};
