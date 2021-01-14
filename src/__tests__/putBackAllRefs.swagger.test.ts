import { putBackAllRefs } from "../putBackAllRefs";
import swagger from "./mock-data/swagger.json";

describe("should pick all $ref value and put them back", () => {
  it("should pick all $ref value and put them back from swagger", () => {
    expect(putBackAllRefs((swagger as any).definitions)).toMatchSnapshot();
  });
});
