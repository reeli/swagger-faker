import * as faker from "faker";
import { toFakeData } from "./faker";
import { SchemaWithoutRef } from "../__types__/common";
import { mapValues, isArray } from "lodash";

export const booleanGenerator = () => faker.random.boolean();
export const stringGenerator = (enums?: any[]) => {
  const getRandomArrayItem = (items: any[]) => items[Math.floor(Math.random() * items.length)];
  return enums ? getRandomArrayItem(enums) : faker.random.words();
};
export const numberGenerator = (max?: number, min?: number) =>
  faker.random.number({
    min,
    max,
  });
export const fileGenerator = () => faker.system.mimeType();
export const dateTimeGenerator = () => faker.date.past().toISOString();
export const dateGenerator = () => dateTimeGenerator().slice(0, 10);
export const timeGenerator = () => dateTimeGenerator().slice(11);
export const urlGenerator = () => faker.internet.url();
export const ipv4Generator = () => faker.internet.ip();
export const ipv6Generator = () => faker.internet.ipv6();
export const emailGenerator = () => faker.internet.email();

export const objectGenerator = (schema: SchemaWithoutRef) => mapValues(schema.properties, (item) => toFakeData(item));
export const arrayGenerator = (schema: SchemaWithoutRef): ReturnType<any> => {
  if (isArray(schema.items)) {
    return schema.items.map((item) => objectGenerator(item));
  }

  return [toFakeData(schema.items!)];
};
