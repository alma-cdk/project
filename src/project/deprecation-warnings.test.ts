import { warnAboutDeprecatedTags } from "./deprecation-warnings";
import { expectErrorMetadata } from "../__test__/expectErrorMetadata";
import { TestableResource } from "../__test__/TestableResource";

test("@alma-cdk/project:legacyTags", () => {
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

test("@alma-cdk/project:compatibility:v0:tags", () => {
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
