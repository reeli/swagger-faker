import faker from "faker";
import { toFakeData } from "./toFakeData";
import { SchemaWithoutRef } from "__types__/common";
import { mapValues, isArray } from "lodash";

const booleanGenerator = () => faker.datatype.boolean();
const stringGenerator = (enums?: any[]) => {
  const getRandomArrayItem = (items: any[]) => items[Math.floor(Math.random() * items.length)];
  return enums ? getRandomArrayItem(enums) : faker.random.words();
};
const numberGenerator = (max?: number, min?: number) =>
  faker.datatype.number({
    min,
    max,
  });
const fileGenerator = () => faker.system.mimeType();
const dateTimeGenerator = () => faker.date.past().toISOString();
const dateGenerator = () => dateTimeGenerator().slice(0, 10);
const timeGenerator = () => dateTimeGenerator().slice(11);
const urlGenerator = () => faker.internet.url();
const ipv4Generator = () => faker.internet.ip();
const ipv6Generator = () => faker.internet.ipv6();
const emailGenerator = () => faker.internet.email();

const fixedFakeData = {
  boolean: true,
  string: "fake string",
  number: 123,
  file: "video/jpm",
  dateTime: "2020-10-17T06:27:33.963Z",
  date: "2021-04-16",
  time: "19:01:06.839Z",
  url: "https://hilda.name",
  ipv4: "10.88.109.17",
  ipv6: "b2f5:9c63:52b2:640b:0360:0e45:9451:0c82",
  email: "john@example.com",
};

export class FakeDataGenerator {
  constructor(private isFixed: boolean) {}

  static of(isFixed: boolean = false) {
    return new FakeDataGenerator(isFixed);
  }

  boolean = () => {
    if (this.isFixed) {
      return fixedFakeData.boolean;
    }

    return booleanGenerator();
  };

  string = (enums?: any[]) => {
    if (this.isFixed) {
      return fixedFakeData.string;
    }

    return stringGenerator(enums);
  };

  number = (max?: number, min?: number) => {
    if (this.isFixed) {
      return fixedFakeData.number;
    }

    return numberGenerator(max, min);
  };

  file = () => {
    if (this.isFixed) {
      return fixedFakeData.file;
    }

    return fileGenerator();
  };

  dateTime = () => {
    if (this.isFixed) {
      return fixedFakeData.dateTime;
    }
    return dateTimeGenerator();
  };

  date = () => {
    if (this.isFixed) {
      return fixedFakeData.date;
    }
    return dateGenerator();
  };

  time = () => {
    if (this.isFixed) {
      return fixedFakeData.time;
    }

    return timeGenerator();
  };

  url = () => {
    if (this.isFixed) {
      return fixedFakeData.url;
    }

    return urlGenerator();
  };

  ipv4 = () => {
    if (this.isFixed) {
      return fixedFakeData.ipv4;
    }

    return ipv4Generator();
  };

  ipv6 = () => {
    if (this.isFixed) {
      return fixedFakeData.ipv6;
    }

    return ipv6Generator();
  };

  email = () => {
    if (this.isFixed) {
      return fixedFakeData.email;
    }

    return emailGenerator();
  };

  object = (schema: SchemaWithoutRef) => {
    return mapValues(schema.properties, (item) => toFakeData(item, this.isFixed));
  };

  array = (schema: SchemaWithoutRef): ReturnType<any> => {
    if (isArray(schema.items)) {
      return schema.items.map((item) => this.object(item));
    }

    return [toFakeData(schema.items!, this.isFixed)];
  };
}
