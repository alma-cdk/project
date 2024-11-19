import { Construct } from 'constructs';
import { Values } from './values';
import { isNonEmptyString } from '../../utils/isNonEmptyString';

export function hasAccount(values: Values): boolean {
  return isNonEmptyString(values.accountType);
}

export function hasEnvironment(values: Values): boolean {
  return isNonEmptyString(values.environmentType);
}

/**
 * Enforces usage of https://github.com/almamedia/alma-cdk-jsii-tag-and-name
 * (for AWS CDK v1) compatible tagging behavior.
 * 
 * @deprecated This behavior is not encouraged and will be removed in v2. Additionally according to GitHub search, this is not used anymore.
 */
export function useLegacyTags(scope: Construct): boolean {
  const contextKey = '@alma-cdk/project:legacyTags';
  return scope.node.tryGetContext(contextKey) === true;
}

/**
 * Compatibility flag for v0 tagging behavior.
 * Due to a bug in v0, the `Contact` and `Organization` tags were NOT applied as they should have.
 * This flag can be used to enforce behavior that matches v0 implementation:
 * I.e. `Contact` and `Organization` tags are NOT applied.
 */
export function useCompatibilityV0Tags(scope: Construct): boolean {
  const contextKey = '@alma-cdk/project:compatibility:v0:tags';
  return scope.node.tryGetContext(contextKey) === true;
}