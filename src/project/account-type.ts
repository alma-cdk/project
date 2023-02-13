import { Construct } from 'constructs';
import { addError } from '../error';

/**
 * Internal class to handle set/get operations for Account Type
 */
export class AccountType {

  static set(scope: Construct, accountType: string): void {
    scope.node.setContext('account-type', accountType);
    scope.node.setContext('account', accountType);
  }

  static get(scope: Construct): string {
    const accountType =
      scope.node.tryGetContext('account-type') ||
      scope.node.tryGetContext('account');

    if (typeof accountType !== 'string') {
      addError(scope,
        'Account Type not specified! Provide account type as context argument for CDK CLI, for example: --context account-type=dev',
      );
      return '';
    }

    return accountType;
  }

}
