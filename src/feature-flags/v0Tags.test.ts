import { useCompatibilityV0Tags, V0_TAGS_CONTEXT_KEY } from "./v0Tags";
import { TestableResource } from "../__test__/TestableResource";

describe("useCompatibilityV0Tags", () => {
  test("context key is correct", () => {
    expect(V0_TAGS_CONTEXT_KEY).toBe("@alma-cdk/project:compatibilityV0Tags");
  });

  test("returns false if the context key is not set", () => {
    const scope = new TestableResource();
    expect(useCompatibilityV0Tags(scope)).toBe(false);
  });

  test("returns true if the context key is set", () => {
    const scope = new TestableResource({
      context: {
        "@alma-cdk/project:compatibilityV0Tags": true,
      },
    });
    expect(useCompatibilityV0Tags(scope)).toBe(true);
  });
});
