import { Construct } from 'constructs';
import { AccountType } from '../configurations/accounts';
import { ProjectContext } from '../project';


export class AccountContext {

  static getAccountId(scope: Construct): string {
    return ProjectContext.getAccountId(scope);
  }

  static getAccountConfig(scope: Construct, key: string): any {
    return ProjectContext.getAccountConfig(scope, key);
  }

  static getAccountType(scope: Construct): string {
    return ProjectContext.getAccountType(scope);
  }

  static isMock(scope: Construct): boolean {
    return AccountContext.isAccountTypeMatch(scope, AccountType.MOCK);
  }

  static isShared(scope: Construct): boolean {
    return AccountContext.isAccountTypeMatch(scope, AccountType.SHARED);
  }

  static isDev(scope: Construct): boolean {
    return AccountContext.isAccountTypeMatch(scope, AccountType.DEV);
  }

  static isPreProd(scope: Construct): boolean {
    return AccountContext.isAccountTypeMatch(scope, AccountType.PREPROD);
  }

  static isProd(scope: Construct): boolean {
    return AccountContext.isAccountTypeMatch(scope, AccountType.PROD);
  }

  private static isAccountTypeMatch(scope: Construct, matchType: AccountType): boolean {
    const type = AccountContext.getAccountType(scope);
    return type === matchType;
  }

}
