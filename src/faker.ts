import { Schema } from "swagger-schema-official";
import { isArray, isEmpty, map, mapValues } from "lodash";
import { booleanGenerator, fileGenerator, numberGenerator, stringGenerator } from "./generators";

type TParameterType = "string" | "number" | "integer" | "boolean" | "array" | "object" | "file";

export const toFaker = (data: { [definitionsName: string]: Omit<Schema, "$ref"> }) =>
  mapValues(data, (item) => toFakeObj(item));

// TODO: handle number maximal and minimal
// TODO: handle enums

export const toFakeObj = (schema: Schema = {}): any => {
  let results = {};
  const getFakeProperties = (properties: Schema) => {
    return mapValues(properties, (property) => {
      switch (property.type) {
        case "object":
          return toFakeObj(property);
        case "array":
          return toFakeItems(property);
        default:
          return toFakeDataByType(property.type as TParameterType, property.example);
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

const toFakeItems = (items: Schema | Schema[]): any[] => {
  if (isEmpty(items)) {
    return [];
  }

  if (isArray(items)) {
    return map(items, (item) => toFakeDataByType(item.type));
  }

  if (items.example) {
    return items.example;
  }

  if (items.items) {
    return isArray(items.items) ? toFakeItems(items.items) : [toFakeItems(items.items)];
  }

  if (items.type === "object") {
    return toFakeObj(items);
  }

  return [toFakeDataByType(items.type)];
};

const toFakeDataByType = (type?: TParameterType, example?: any) => {
  if (example) {
    return example;
  }

  switch (type) {
    case "boolean":
      return booleanGenerator();
    case "string":
      return stringGenerator();
    case "number":
    case "integer":
      return numberGenerator();
    case "file":
      return fileGenerator();
    default:
      return "";
  }
};
