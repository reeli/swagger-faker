import { putBackRefs } from "../putBackRefs";
import { IOpenAPI } from "../../__types__/OpenAPI";
import { toFaker } from "../faker";
import openApi from "./openapi.json";
import { mockOpenApi } from "./mocks";

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

    expect(toFaker(input)).toEqual({
      categories: {
        id: 29274,
        name: "Gold",
      },
      contentType: "Product",
      id: 95890,
      name: "killer Liaison",
      reason: "grey Crest",
      tag: "capacitor Chicken Tactics",
    });
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

    expect(toFaker(input)).toEqual({
      id: "Tactics Tuna Sleek",
      item: {
        children: {
          id: "fault-tolerant connect",
          item: {
            children: {
              id: "experiences",
              item: {
                children: {
                  id: "intranet B2B Implementation",
                  item: null,
                  name: "Swiss Franc Small Metal Chicken withdrawal",
                },
                id: "incubate Burundi Franc white",
              },
              name: "Practical Cotton",
            },
            id: "Tuna",
          },
          name: "Total",
        },
        id: "impactful",
      },
      name: "Creative",
    });
  });
});
