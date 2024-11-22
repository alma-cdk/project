import { Annotations } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as featureFlags from "../feature-flags";

export function warnAboutDeprecatedTags(scope: Construct) {
  if (featureFlags.useLegacyTags(scope)) {
    Annotations.of(scope).addWarningV2(
      "@alma-cdk/project@v1:legacy-tags",
      `Using @almamedia-cdk/tag-and-name (for AWS CDK v1) construct's legacy tagging behavior via "${featureFlags.LEGACY_TAGS_CONTEXT_KEY}" context key. This is not encouraged and will be removed in v2.`,
    );
  }

  if (featureFlags.useCompatibilityV0Tags(scope)) {
    Annotations.of(scope).addWarningV2(
      "@alma-cdk/project@v1:compatibility-v0-tags",
      `Using @alma-cdk/project@v0 construct's tagging behavior via "${featureFlags.V0_TAGS_CONTEXT_KEY}" context key. You should migrate to using the default tagging behavior as this feature flag will be removed in v2.`,
    );
  }
}
