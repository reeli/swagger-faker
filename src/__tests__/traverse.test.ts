import { Traverse } from "../traverse";
import { mockDefinitions } from "./mock-data/mockDefinitiions";
import { traverseExpectedValue } from "./mock-data/traverseMocks";

describe("traverse", () => {
  it("should replace ref", () => {
    const data = Traverse.of(mockDefinitions).traverse();
    expect(data).toEqual(traverseExpectedValue);
  });
});
