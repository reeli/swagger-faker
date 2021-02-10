import { ISchema } from "../__types__/OpenAPI";
import { mapValues, isArray } from "lodash";
import { booleanGenerator, numberGenerator, stringGenerator } from "../generators";

interface SchemaWithoutRef extends ISchema {
  not?: ISchema;
  allOf?: Array<ISchema>;
  oneOf?: Array<ISchema>;
  anyOf?: Array<ISchema>;
  items?: ISchema;
  properties?: {
    [k: string]: ISchema;
  };
  propertyNames?: ISchema;
  additionalProperties?: ISchema | boolean;
}

export const toFakeData = (schema: SchemaWithoutRef): ReturnType<any> => {
  if (!schema) {
    return schema;
  }

  if (schema.type === "object" || schema.properties) {
    return toFakeObj(schema);
  }

  if (schema.type === "array") {
    return schema.items ? toFakeArray(schema) : [];
  }

  if (schema.type === "boolean") {
    return booleanGenerator();
  }

  if (schema.type === "integer" || schema.type === "number") {
    return numberGenerator();
  }

  if (schema.type === "string") {
    return stringGenerator();
  }

  return null;
};

const toFakeObj = (schema: SchemaWithoutRef) => mapValues(schema.properties, (item) => toFakeData(item));

const toFakeArray = (schema: SchemaWithoutRef): ReturnType<any> => {
  if (isArray(schema.items)) {
    return schema.items.map((item) => toFakeObj(item));
  }

  return toFakeObj(schema.items as ISchema);
};
