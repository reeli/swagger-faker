import { putBackAllRefs } from "../putBackAllRefs";
import openapi from "./mock-data/openapi.json";

describe("#putBackAllRefs", () => {
  it("should pick all $ref value and put them back from openapi", () => {
    expect(putBackAllRefs((openapi as any).components.schemas)).toMatchSnapshot();
  });
});
