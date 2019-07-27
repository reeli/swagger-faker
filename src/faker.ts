import { Schema } from "swagger-schema-official";
import { mapValues } from "lodash";

export const getFaker = (schema: Schema = {}) => {
  if (schema.type === "object") {
    return mapValues(schema.properties, (property) => {
      if (property && property.type && dataMapping[property.type]) {
        return dataMapping[property.type];
      }
      return {};
    });
  }
};

const dataMapping: any = {
  string: "xxx",
  number: 11,
  integer: 111,
  boolean: true,
  file: "xxx file",
};

export enum SwaggerDataTypes {
  string = "string",
  number = "number",
  integer = "integer",
  boolean = "boolean",
  array = "array",
  object = "object",
  file = "file",
}

// TODO: handle number maximal and minimal
