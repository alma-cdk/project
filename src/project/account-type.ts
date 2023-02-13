import { Construct } from 'constructs';
import { ProjectConfiguration } from './interfaces';
import { addError } from '../error';
import { resolveTarget } from '../resolver';

/**
 * Internal class to handle set/get operations for Account Type
 */
export class AccountType {

  static set(scope: Construct, accountType: string): void {
    scope.node.setContext('account-type', accountType);
    scope.node.setContext('account', accountType);
  }

  static get(scope: Construct, projectConfiguration: ProjectConfiguration): string {
    const target = resolveTarget(scope, projectConfiguration);
    if (typeof target === 'undefined') {
      addError(scope,
        'Account Type not specified! Provide account type as context argument for CDK CLI, for example: --context account-type=dev',
      );
      return '';
    }

    return target.account.type;
  }

}
