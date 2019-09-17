import * as faker from "faker";

export const getRandomArrayItem = (items: any[]) => items[Math.floor(Math.random() * items.length)];
export const booleanGenerator = () => faker.random.boolean();
export const stringGenerator = (enumList?: any[]) => (enumList ? getRandomArrayItem(enumList) : faker.random.words());
export const numberGenerator = (max?: number, min?: number) =>
  faker.random.number({
    min,
    max,
  });
export const fileGenerator = () => faker.system.mimeType();
