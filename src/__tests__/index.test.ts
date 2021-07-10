import {fakerGenFromObj} from "../index";
import openApi from "./mocks/openapi.json";
import {IOpenAPI} from "../__types__/OpenAPI";
import {fakerGenFromObjExpectation1} from "./mocks/expectations";

describe('#fakerGenFromObj', () => {
  it('should generate fake date when given openapi object', () => {
    expect(fakerGenFromObj(openApi as IOpenAPI, false)).toEqual(fakerGenFromObjExpectation1)
  });
});
