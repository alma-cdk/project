import { useCompatibilityV0Tags, useLegacyTags } from "./checks";
import { TestableResource } from "./test-helpers/TestableResource";

describe("useLegacyTags", () => {
  test("returns false if the context key is not set", () => {
    const scope = new TestableResource();
    expect(useLegacyTags(scope)).toBe(false);
  });

  test("returns true if the context key is set", () => {
    const scope = new TestableResource({
      context: {
        "@alma-cdk/project:legacyTags": true,
      },
    });
    expect(useLegacyTags(scope)).toBe(true);
  });
});

describe("useCompatibilityV0Tags", () => {
  test("returns false if the context key is not set", () => {
    const scope = new TestableResource();
    expect(useCompatibilityV0Tags(scope)).toBe(false);
  });

  test("returns true if the context key is set", () => {
    const scope = new TestableResource({
      context: {
        "@alma-cdk/project:compatibility:v0:tags": true,
      },
    });
    expect(useCompatibilityV0Tags(scope)).toBe(true);
  });
});
