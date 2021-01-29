import { resolveResponse } from "../faker";
import { mockOpenApi, expectedResults } from "./mocks";

describe("faker", () => {
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
