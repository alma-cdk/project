import { pascalCase } from 'change-case';
import { Construct } from 'constructs';
import { AccountContext } from '../context/account';

/**
 * Wrapper for account-level stacks.
 */
export class AccountWrapper extends Construct {

  constructor(scope: Construct) {

    const accountType = AccountContext.getAccountType(scope);
    const id = `${pascalCase(accountType)}Account`;

    super(scope, id);

    // Ensure no environment access from within Account Construct
    this.node.setContext('environment-type', undefined);
    this.node.setContext('environment', undefined);
    this.node.setContext('env', undefined);
  }
}


