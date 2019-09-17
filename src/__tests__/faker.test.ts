import { Traverse } from "../traverse";
import { mockDefinitions } from "./mock-data/mockDefinitiions";
import { fakerExpectedValue } from "./mock-data/fakerMocks";

describe("faker", () => {
  beforeAll(() => {
    jest.mock("faker", () => {
      return {
        random: {
          words: () => "string words",
          number: () => 123,
          boolean: () => true,
        },
        system: {
          mimeType: () => "File",
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
