import { Construct } from 'constructs';
import { get } from 'lodash';
import { addError } from '../error';
import { AccountType } from './account-type';
import { EnvironmentType } from './environment-type';
import { Account } from './interfaces';
import { Project } from './project';

export class ProjectContext {
  /**
   * Returns the account type given in runtime/CLI context
   */
  static getAccountType(scope: Construct): string {
    return AccountType.get(scope);
  }

  static getAccountId(scope: Construct): string {
    const account = ProjectContext.getProjectAccountConfiguration(scope);
    if (!account.id) {
      addError(scope, `Account ${this.getName(scope)} does not have an ID`);
    }
    return account.id;
  }

  static getAccountConfig(scope: Construct, key: string, defaultValue?: any): any {
    const account = ProjectContext.getProjectAccountConfiguration(scope);
    const value = get(account.config, key, defaultValue);
    if (value === undefined || value === '') {
      addError(scope, `Account ${this.getName(scope)} does not have a config with key ${key}`);
    }
    return value;
  }

  static getDefaultRegion(scope: Construct): string {
    const projectConfiguration = Project.getConfiguration(scope);
    return projectConfiguration.defaultRegion!;
  }

  static getName(scope: Construct): string {
    const projectConfiguration = Project.getConfiguration(scope);
    return projectConfiguration.name;
  }

  static getAuthorOrganization(scope: Construct): string | undefined {
    const projectConfiguration = Project.getConfiguration(scope);
    return projectConfiguration.author.organization;
  }

  static getAuthorName(scope: Construct): string {
    const projectConfiguration = Project.getConfiguration(scope);
    return projectConfiguration.author.name;
  }

  static getAuthorEmail(scope: Construct): string | undefined {
    const projectConfiguration = Project.getConfiguration(scope);
    return projectConfiguration.author.email;
  }

  static getAllowedEnvironments(scope: Construct): string[] {
    const account = ProjectContext.getProjectAccountConfiguration(scope);
    return account.environments || [];
  }

  static tryGetEnvironment(scope: Construct): string | undefined {
    return EnvironmentType.tryGet(scope);
  }

  static getEnvironment(scope: Construct): string {
    const allowedEnvironments = ProjectContext.getAllowedEnvironments(scope);
    return EnvironmentType.get(scope, allowedEnvironments);
  }

  /**
   * Low-level / internal method which in most cases you should not use or depend upon.
   *
   * TODO Figure out
   *
   * @internal
   */
  static _getAccountTypeByEnvironment(
    scope: Construct,
    environmentType: string,
  ): string {
    const projectConfiguration = Project.getConfiguration(scope);
    return AccountType.matchFromEnvironment(scope, projectConfiguration.accounts, environmentType);
  }

  /**
   * Returns the account specific project configuration
   */
  private static getProjectAccountConfiguration(scope: Construct): Account {
    const accountType = ProjectContext.getAccountType(scope);
    const account = Project.getAccount(scope, accountType);
    return account;
  }
}
