import { Construct } from "constructs";

export const V0_TAGS_CONTEXT_KEY = "@alma-cdk/project:compatibilityV0Tags";

/**
 * Compatibility flag for v0 tagging behavior.
 * Due to a bug in v0, the `Contact` and `Organization` tags were NOT applied as they should have.
 * This flag can be used to enforce behavior that matches v0 implementation:
 * I.e. `Contact` and `Organization` tags are NOT applied.
 *
 * @deprecated This behavior is not encouraged and will be removed in v2.
 */
export function useCompatibilityV0Tags(scope: Construct): boolean {
  return scope.node.tryGetContext(V0_TAGS_CONTEXT_KEY) === true;
}
