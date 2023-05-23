import { fakerGenFromObj, fakerGenFromPath } from "../index";
import { jsonResponse } from "./mocks/jsonResponse";
import openApi from "./mocks/openapi.json";
import swagger from "./mocks/swagger.json";
import { IOpenAPI } from "../../../__types__/OpenAPI";
import { fakerGenFromObjExpectationFromSwagger, fakerGenFromObjExpectationFromOpenApi } from "./mocks/expectations";
import { Spec } from "swagger-schema-official";
import { yamlResponse } from "./mocks/yamlResponse";

describe("#fakerGenFromObj", () => {
  it("should generate fake data when given openapi object", async () => {
    expect(await fakerGenFromObj(openApi as IOpenAPI, true)).toEqual(fakerGenFromObjExpectationFromOpenApi);
  });

  it("should generate fake data when given swagger object", async () => {
    expect(await fakerGenFromObj(swagger as Spec, true)).toEqual(fakerGenFromObjExpectationFromSwagger);
  });

  it("should generate fake data when given remote swagger path with json format", async () => {
    expect(await fakerGenFromPath("https://petstore.swagger.io/v2/swagger.json", true)).toEqual(jsonResponse);
  });

  it("should generate fake pii when given remote swagger path with yaml format", async () => {
    expect(await fakerGenFromPath("https://petstore.swagger.io/v2/swagger.yaml", true)).toEqual(yamlResponse);
  });
});
