import { Construct } from "constructs";

export const LEGACY_TAGS_CONTEXT_KEY = "@alma-cdk/project:legacyTags";

/**
 * Enforces usage of https://github.com/almamedia/alma-cdk-jsii-tag-and-name
 * (for AWS CDK v1) compatible tagging behavior.
 *
 * @deprecated This behavior is not encouraged and will be removed in v2. Additionally according to GitHub search, this is not used anymore.
 */
export function useLegacyTags(scope: Construct): boolean {
  return scope.node.tryGetContext(LEGACY_TAGS_CONTEXT_KEY) === true;
}
