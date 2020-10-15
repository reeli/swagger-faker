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

export const dateTimeGenerator = () => faker.date.past().toISOString();
export const dateGenerator = () => dateTimeGenerator().slice(0, 10);
export const timeGenerator = () => dateTimeGenerator().slice(11);
export const urlGenerator = () => faker.internet.url();
export const ipv4Generator = () => faker.internet.ip();
export const ipv6Generator = () => faker.internet.ipv6();
export const emailGenerator = () => faker.internet.email();
