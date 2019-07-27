import { Schema } from "swagger-schema-official";
import { isArray, isEmpty, mapValues } from "lodash";
import { booleanGenerator, fileGenerator, numberGenerator, stringGenerator } from "./generators";

type TParameterType = "string" | "number" | "integer" | "boolean" | "array" | "object" | "file";

// TODO: remove return value definition "any"
export const getFaker = (schema: Schema = {}): any => {
  if (schema.type === "object") {
    return mapValues(schema.properties, (property) => {
      // TODO: handle number maximal and minimal
      // TODO: handle enums
      if (property && property.type) {
        if (property.type === "object") {
          return getFaker(property);
        }

        if (property.type === "array") {
          return generateItems(property);
        }

        return generateFakeDataByType(property.type as TParameterType, property.example);
      }
      return {};
    });
  }
};

// TODO: remove return value definition "any"
const generateItems = (items: Schema | Schema[]): any => {
  if (isArray(items) || isEmpty(items)) {
    return [];
  }

  if (items.example) {
    return items.example;
  }

  if (items.type === "array") {
    return items.items && [generateItems(items.items)];
  }

  if (items.type === "object") {
    return getFaker(items);
  }

  return [generateFakeDataByType(items.type as any, items.example)];
};

// TODO: File is not a standard type in swagger v2
export const generateFakeDataByType = (type: TParameterType, example?: any) => {
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
