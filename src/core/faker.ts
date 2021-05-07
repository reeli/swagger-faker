import {
  dateGenerator,
  timeGenerator,
  dateTimeGenerator,
  urlGenerator,
  ipv4Generator,
  ipv6Generator,
  emailGenerator,
  booleanGenerator,
  numberGenerator,
  stringGenerator,
  arrayGenerator,
  objectGenerator,
} from "./generators";
import { SchemaWithoutRef } from "../__types__/common";

export const toFakeData = (schema: SchemaWithoutRef): ReturnType<any> => {
  if (!schema) {
    return schema;
  }

  if (schema.type === "object" || schema.properties) {
    return objectGenerator(schema);
  }

  if (schema.type === "array") {
    return schema.items ? arrayGenerator(schema) : [];
  }

  if (schema.type === "boolean") {
    return booleanGenerator();
  }

  if (schema.type === "integer" || schema.type === "number") {
    return numberGenerator();
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

    return stringGenerator();
  }

  return null;
};
