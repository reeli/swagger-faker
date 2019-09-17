import * as faker from "faker";

export const booleanGenerator = () => faker.random.boolean();
export const stringGenerator = () => faker.random.words();
export const numberGenerator = (max?: number, min?: number) =>
  faker.random.number({
    min,
    max,
  });
export const fileGenerator = () => faker.system.mimeType();
