import { Construct } from 'constructs';

/**
 * Get the Account Name received from Runtime Context (if any).
 *
 * @param scope Construct Scope
 * @returns Account Name received from Runtime Context (if any)
 */
export function getCtxAccount(scope: Construct): string | undefined {
  return scope.node.tryGetContext('account-type') ||
      scope.node.tryGetContext('account');
}

/**
 * Get the Environment Name received from Runtime Context (if any).
 *
 * @param scope Construct Scope
 * @returns Environment Name received from Runtime Context (if any)
 */
export function getCtxEnvironment(scope: Construct): string | undefined {
  return scope.node.tryGetContext('environment-type') ||
  scope.node.tryGetContext('environment') ||
  scope.node.tryGetContext('env');
}
