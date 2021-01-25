import { resolveResponse } from "../schema";
import { mockOpenApi, expectedResults } from "./mocks";

describe("schemas", () => {
  it("should handle circular $ref", () => {
    expect(
      resolveResponse(
        {
          $ref: "#/components/schemas/Tree",
        },
        mockOpenApi,
      ),
    ).toEqual(expectedResults);
  });
});
