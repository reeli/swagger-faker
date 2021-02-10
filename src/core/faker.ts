import { ISchema } from "../__types__/OpenAPI";
import { mapValues, isArray } from "lodash";
import {
  dateGenerator,
  timeGenerator,
  dateTimeGenerator,
  urlGenerator,
  ipv4Generator,
  ipv6Generator,
  emailGenerator,
} from "../generators";
import faker from "faker";

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
    return fakeBoolean();
  }

  if (schema.type === "integer" || schema.type === "number") {
    return fakeNumber();
  }

  if (schema.type === "string") {
    if (schema.format === "date") {
      return dateGenerator();
    }

    if (schema.format === "time") {
      return timeGenerator();
    }

    if (schema.format === "date-time") {
      return dateTimeGenerator();
    }
    if (schema.format === "uri") {
      return urlGenerator();
    }

    if (schema.format === "ipv4") {
      return ipv4Generator();
    }

    if (schema.format === "ipv6") {
      return ipv6Generator();
    }

    if (schema.format === "email") {
      return emailGenerator();
    }

    return fakeString();
  }

  return null;
};

const toFakeObj = (schema: SchemaWithoutRef) => mapValues(schema.properties, (item) => toFakeData(item));

const toFakeArray = (schema: SchemaWithoutRef): ReturnType<any> => {
  if (isArray(schema.items)) {
    return schema.items.map((item) => toFakeObj(item));
  }

  return [toFakeData(schema.items!)];
};

export const fakeBoolean = () => faker.random.boolean();

export const fakeString = () => faker.random.words();
export const fakeFile = () => faker.system.mimeType();

export const fakeNumber = (max?: number, min?: number) =>
  faker.random.number({
    min,
    max,
  });
