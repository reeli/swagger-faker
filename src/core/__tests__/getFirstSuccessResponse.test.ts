import { getFirstSuccessResponse } from "../getFirstSuccessResponse";

const mockResponses = {
  "200": {
    description: "pet response",
    content: {
      "application/json": {
        schema: {
          $ref: "#/components/schemas/Pet",
        },
      },
    },
  },
  default: {
    description: "unexpected error",
    content: {
      "application/json": {
        schema: {
          $ref: "#/components/schemas/Error",
        },
      },
    },
  },
};

describe("#getFirstSuccessResponse", () => {
  it("should pick first success response from several responses", () => {
    expect(getFirstSuccessResponse(mockResponses)).toEqual({
      contentType: "application/json",
      data: {
        $ref: "#/components/schemas/Pet",
      },
      description: "pet response",
    });
  });
});
