import {fakerGenFromObj} from "../index";
import openApi from "./mocks/openapi.json";
import swagger from "./mocks/swagger.json";
import {IOpenAPI} from "../../../__types__/OpenAPI";
import {
  fakerGenFromObjExpectationFromSwagger,
  fakerGenFromObjExpectationFromOpenApi,
} from "./mocks/expectations";
import {Spec} from "swagger-schema-official";

describe("#fakerGenFromObj", () => {
  it("should generate fake date when given openapi object", async () => {
    expect(await fakerGenFromObj(openApi as IOpenAPI, true)).toEqual(fakerGenFromObjExpectationFromOpenApi);
  });

  it("should generate fake date when given swagger object", async () => {
    expect(await fakerGenFromObj(swagger as Spec, true)).toEqual(fakerGenFromObjExpectationFromSwagger);
  });
});
