import { Traverse } from "../traverse";
import { mockDefinitions } from "./mock-data/mockDefinitiions";
import { fakerExpectedValue } from "./mock-data/fakerMocks";

describe("faker", () => {
  beforeAll(() => {
    jest.mock("faker", () => {
      return {
        random: {
          words: () => "string words",
          number: ({ min, max }: { min?: number; max?: number }) => {
            if (min && max) {
              return min;
            }
            if (min) {
              return min;
            }
            if (max) {
              return max;
            }
            return 123;
          },
          boolean: () => true,
        },
        system: {
          mimeType: () => "File",
        },
        date: {
          past: () => new Date("2012-03-06T06:34:23.010+00:00"),
        },
        internet: {
          url: () => "https://www.google.com",
          ip: () => "127.0.0.1",
          ipv6: () => "::1",
          email: () => "john@example.com",
        },
      };
    });
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it("should get correct fake data", () => {
    const { toFaker } = require("../faker");
    const data = Traverse.of(mockDefinitions).traverse();
    expect(toFaker(data)).toEqual(fakerExpectedValue);
  });
});
