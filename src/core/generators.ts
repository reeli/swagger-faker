import * as faker from "faker";
import {toFakeData} from "./toFakeData";
import {SchemaWithoutRef} from "common";
import {mapValues, isArray} from "lodash";

export class FakeDataGenerator {
  static of() {
    return new FakeDataGenerator();
  }

  boolean = () => faker.random.boolean();

  string = (enums?: any[]) => {
    const getRandomArrayItem = (items: any[]) => items[Math.floor(Math.random() * items.length)];
    return enums ? getRandomArrayItem(enums) : faker.random.words();
  }

  number = (max?: number, min?: number) =>
    faker.random.number({
      min,
      max,
    });

  file = () => faker.system.mimeType();

  dateTime = () => faker.date.past().toISOString();

  date = () => this.dateTime().slice(0, 10);

  time = () => this.dateTime().slice(11)

  url = () => faker.internet.url();

  ipv4 = () => faker.internet.ip();

  ipv6 = () => faker.internet.ipv6();

  email = () => faker.internet.email();

  object = (schema: SchemaWithoutRef) => mapValues(schema.properties, (item) => toFakeData(item));

  array = (schema: SchemaWithoutRef): ReturnType<any> => {
    if (isArray(schema.items)) {
      return schema.items.map((item) => this.object(item));
    }

    return [toFakeData(schema.items!)];
  };
}
