import { getFirstSuccessResponse, isJSON, isMatch, toRoutePattern } from "../utils";

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

describe("#isJSON", () => {
  it("should test json", () => {
    expect(
      isJSON({
        description: "Future Data",
        filename: "Granite hard",
        open: false,
        readable: true,
      }),
    ).toEqual(true);
  });
});

describe("#isMatch", () => {
  it("should return true if given route is match the route pattern", () => {
    expect(isMatch("/api/v3/pets/:id")("/api/v3/pets/111")).toEqual(true);
    expect(isMatch("/api/v3/pets/:id")("/api/v3/pets1/111")).toEqual(false);
  });
});

describe("#toRoutePattern", () => {
  it("should convert str to routes pattern", () => {
    expect(toRoutePattern("/api/v3/pets/{id}")).toEqual("/api/v3/pets/:id");
    expect(toRoutePattern("/api/v3/{port}/pets/{id}")).toEqual("/api/v3/:port/pets/:id");
  });
});
