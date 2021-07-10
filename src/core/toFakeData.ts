import { SchemaWithoutRef } from "common";
import {FakeDataGenerator} from "./generators";

export const toFakeData = (schema: SchemaWithoutRef): ReturnType<any> => {
  if (!schema) {
    return schema;
  }
  const fakeData = FakeDataGenerator.of();

  if (schema.type === "object" || schema.properties) {
    return fakeData.object(schema);
  }

  if (schema.type === "array") {
    return schema.items ? fakeData.array(schema) : [];
  }

  if (schema.type === "boolean") {
    return fakeData.boolean();
  }

  if (schema.type === "integer" || schema.type === "number") {
    return fakeData.number();
  }

  if (schema.type === "string") {
    if (schema.format === "date") {
      return fakeData.date();
    }

    if (schema.format === "time") {
      return fakeData.time();
    }

    if (schema.format === "date-time") {
      return fakeData.dateTime();
    }
    if (schema.format === "uri") {
      return fakeData.url();
    }

    if (schema.format === "ipv4") {
      return fakeData.ipv4();
    }

    if (schema.format === "ipv6") {
      return fakeData.ipv6();
    }

    if (schema.format === "email") {
      return fakeData.email();
    }

    return fakeData.string();
  }

  return null;
};
