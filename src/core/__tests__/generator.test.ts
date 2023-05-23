import { FakeDataGenerator } from "../generators";
import { putBackRefs } from "../putBackRefs";
import { IOpenAPI } from "../../../__types__/OpenAPI";
import openApi from "./mocks/openapi.json";
import { mockOpenApi } from "./mocks/mocks";

jest.mock("@faker-js/faker", () => {
  return {
    faker: {
      lorem: { words: () => "string words" },
      number: {
        int: ({ min, max }: { min?: number; max?: number }) => {
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
      },
      datatype: {
        boolean: () => true,
      },
      system: {
        mimeType: () => "File",
      },
      date: {
        past: () => new Date(2012, 2, 6, 6, 34, 23, 10),
      },
      internet: {
        url: () => "https://www.google.com",
        ip: () => "127.0.0.1",
        ipv6: () => "::1",
        email: () => "john@example.com",
      },
    },
  };
});

describe("faker", () => {
  it("should generate correct fake data if given schema contains array", () => {
    const input = putBackRefs({
      schema: {
        type: "array",
        items: {
          $ref: "#/components/schemas/Pet",
        },
      },
      openApi: openApi as IOpenAPI,
      ctx: {
        parents: [],
        currentDepth: undefined,
        maxDepth: 4,
      },
    });

    const generator = FakeDataGenerator.of(false);

    expect(generator.toFakeData(input)).toEqual([
      {
        categories: [
          {
            id: 123,
            name: "string words",
          },
        ],
        contentType: "string words",
        id: 123,
        name: "string words",
        reason: "string words",
        tag: "string words",
      },
    ]);
  });

  it("should generate correct fake data if given schema contains circular ref", () => {
    const input = putBackRefs({
      schema: {
        $ref: "#/components/schemas/Tree",
      },
      openApi: mockOpenApi,
      ctx: {
        parents: [],
        currentDepth: undefined,
        maxDepth: 4,
      },
    });

    const generator = FakeDataGenerator.of(false);

    expect(generator.toFakeData(input)).toEqual({
      id: "string words",
      item: {
        children: {
          id: "string words",
          item: {
            children: {
              id: "string words",
              item: {
                children: {
                  id: "string words",
                  item: null,
                  name: "string words",
                },
                id: "string words",
              },
              name: "string words",
            },
            id: "string words",
          },
          name: "string words",
        },
        id: "string words",
      },
      name: "string words",
    });
  });
});
