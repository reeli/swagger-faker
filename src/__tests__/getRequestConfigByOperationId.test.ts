import {getRequestConfigByOperationId} from "../getRequestConfigByOperationId";
import swagger from "./mock-data/swagger.json";
import {Spec} from "swagger-schema-official";

describe("#getRequestConfigByOperationId", () => {
  it("should get correct request config by using operation id", () => {
    const swaggerSpec = swagger as Spec;

    expect(getRequestConfigByOperationId(swaggerSpec, "addPet")).toEqual({
      path: "/pet",
      basePath: "/v2",
      method: "post",
      response: {},
      queryParams: [],
    });

    expect(getRequestConfigByOperationId(swaggerSpec, "findPetsByStatus")).toEqual({
      path: "/pet/findByStatus",
      basePath: "/v2",
      method: "get",
      response: [
        {
          category: {
            id: 222,
            name: "Jay",
          },
          id: 111,
          name: "doggie",
          photoUrls: ["a.png", "b.png"],
          status: "available",
          tags: [
            {
              id: 111,
              name: "Lucy",
            },
          ],
        },
      ],
      queryParams: ["status"],
    });
  });
});
