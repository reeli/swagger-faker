import { Traverse } from "../traverse";
import { expectedValue, traverseMocks } from "./mock-data/traverseMocks";

describe("traverse", () => {
  it("should replace ref", () => {
    const data = Traverse.of(traverseMocks).traverse();
    expect(data).toEqual(expectedValue);
  });
});
