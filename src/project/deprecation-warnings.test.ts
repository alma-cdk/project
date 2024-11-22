import { warnAboutDeprecatedTags } from "./deprecation-warnings";
import { expectErrorMetadata } from "../__test__/expectErrorMetadata";
import { TestableResource } from "../__test__/TestableResource";

describe("@alma-cdk/project:legacyTags", () => {
  test("feature flag present", () => {
    const testable = new TestableResource({
      context: {
        "@alma-cdk/project:legacyTags": true,
      },
    });

    warnAboutDeprecatedTags(testable);

    expectErrorMetadata(
      testable,
      expect.stringContaining("@alma-cdk/project@v1:legacy-tags"),
    );
  });

  test("feature flag missing", () => {
    const testable = new TestableResource();

    warnAboutDeprecatedTags(testable);

    expectErrorMetadata(testable, undefined);
  });
});

describe("@alma-cdk/project:compatibility:v0:tags", () => {
  test("feature flag present", () => {
    const testable = new TestableResource({
      context: {
        "@alma-cdk/project:compatibility:v0:tags": true,
      },
    });

    warnAboutDeprecatedTags(testable);

    expectErrorMetadata(
      testable,
      expect.stringContaining("@alma-cdk/project@v1:compatibility-v0-tags"),
    );
  });

  test("feature flag missing", () => {
    const testable = new TestableResource();

    warnAboutDeprecatedTags(testable);

    expectErrorMetadata(testable, undefined);
  });
});
