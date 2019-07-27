import * as faker from "faker";

export const booleanGenerator = () => Math.floor(Math.random() * 10) >= 5;
export const stringGenerator = () => faker.random.words();
export const numberGenerator = () => faker.random.number();
export const integerGenerator = () => faker.random.number();
export const fileGenerator = () => faker.system.mimeType();
