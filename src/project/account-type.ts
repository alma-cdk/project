import { Construct } from 'constructs';
import { findKey } from 'lodash';
import { addError } from '../error';
import { EnvRegExp } from './envregexp';
import { Account } from './interfaces';

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
    }

    return accountType;
  }

  static matchFromEnvironment(
    scope: Construct,
    accounts: Record<string, Account>,
    environmentType: string,
  ): string {

    const accountType = findKey(accounts, (account) =>
      account.environments?.filter((environment) =>
        new EnvRegExp(environment).test(environmentType),
      ),
    );

    if (typeof accountType !== 'string') {
      addError(scope,
        `Could not find matching account type for given environment ${environmentType}`,
      );
      return '';
    }

    return accountType;
  }

}
