import * as faker from "faker";

export const booleanGenerator = () => faker.random.boolean();
export const stringGenerator = () => faker.random.words();
export const numberGenerator = () => faker.random.number();
export const fileGenerator = () => faker.system.mimeType();
