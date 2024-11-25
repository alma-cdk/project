import { useLegacyTags, LEGACY_TAGS_CONTEXT_KEY } from "./legacyTags";
import { TestableResource } from "../__test__/TestableResource";

describe("useLegacyTags", () => {
  test("context key is correct", () => {
    expect(LEGACY_TAGS_CONTEXT_KEY).toBe("@alma-cdk/project:legacyTags");
  });

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
