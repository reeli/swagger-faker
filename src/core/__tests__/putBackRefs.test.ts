import { putBackRefs } from "../putBackRefs";
import { mockOpenApi, expectedResults, expectedResults1, expectedResults2 } from "./mocks";
import openApi from "./openapi.json";
import { IOpenAPI } from "../../__types__/OpenAPI";

describe("#putBackRefs", () => {
  it("should handle circular $ref", () => {
    expect(
      putBackRefs({
        schema: {
          $ref: "#/components/schemas/Tree",
        },
        openApi: mockOpenApi,
        ctx: {
          parents: [],
          currentDepth: undefined,
          maxDepth: 4,
        },
      }),
    ).toEqual(expectedResults);
  });

  it("should handle non circular ref", () => {
    expect(
      putBackRefs({
        schema: {
          $ref: "#/components/schemas/Message",
        },
        openApi: openApi as IOpenAPI,
        ctx: {
          parents: [],
          currentDepth: undefined,
          maxDepth: 4,
        },
      }),
    ).toEqual(expectedResults1);
  });

  it("should handle allOf", () => {
    expect(
      putBackRefs({
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
      }),
    ).toEqual(expectedResults2);
  });
});
