import { Account } from '../project';
import { EnvironmentLabel } from './environments';

export enum AccountType {
  MOCK='mock',
  SHARED='shared',
  DEV='dev',
  PREPROD='preprod',
  PROD='prod',
}

export interface AccountConfiguration {
  readonly id: string;
  readonly config?: Record<string, any>;
}

export interface ProjectAccounts {
  readonly mock?: Account;
  readonly shared?: Account;
  readonly dev?: Account;
  readonly preprod?: Account;
  readonly prod?: Account;
}

export interface AccountsOneProps {
  readonly [AccountType.MOCK]?: AccountConfiguration;
  readonly [AccountType.SHARED]: AccountConfiguration;
}

export interface AccountsTwoProps {
  readonly [AccountType.MOCK]?: AccountConfiguration;
  readonly [AccountType.DEV]: AccountConfiguration;
  readonly [AccountType.PROD]: AccountConfiguration;
}

export interface AccountsThreeProps {
  readonly [AccountType.MOCK]?: AccountConfiguration;
  readonly [AccountType.DEV]: AccountConfiguration;
  readonly [AccountType.PREPROD]: AccountConfiguration;
  readonly [AccountType.PROD]: AccountConfiguration;
}

const emptyMockAccountProps: AccountConfiguration = {
  id: '123456789012',
};


export class Accounts {

  /**
   * Enables single account strategy.
   *
   * 1. `shared` account with environments:
   *    - development
   *    - feature/*
   *    - test
   *    - qaN
   *    - staging
   *    - preproduction
   *    - production
   *
   * @example
   * Accounts.ONE({
   *   shared: {
   *     id: '111111111111',
   *   },
   * }),
   */
  public static one(props: AccountsOneProps): Record<string, Account> {
    const mockProps = props[AccountType.MOCK];
    return {
      [AccountType.MOCK]: {
        ...(mockProps ? mockProps : emptyMockAccountProps),
        environments: [
          EnvironmentLabel.MOCK,
        ],
      },
      [AccountType.SHARED]: {
        ...props[AccountType.SHARED],
        environments: [
          EnvironmentLabel.DEVELOPMENT,
          EnvironmentLabel.FEATURE,
          EnvironmentLabel.TEST,
          EnvironmentLabel.QA,
          EnvironmentLabel.STAGING,
          EnvironmentLabel.PREPRODUCTION,
          EnvironmentLabel.PRODUCTION,
        ],
      },
    };
  }

  /**
   * Enables dual account strategy.
   *
   * 1. `dev` account with environments:
   *    - development
   *    - feature/*
   *    - test
   *    - qaN
   *    - staging
   * 2. `prod` account with environments:
   *    - preproduction
   *    - production
   *
   * @example
   * Accounts.TWO({
   *   dev: {
   *     id: '111111111111',
   *   },
   *   prod: {
   *     id: '222222222222',
   *   },
   * }),
   */
  public static two(props: AccountsTwoProps): Record<string, Account> {
    const mockProps = props[AccountType.MOCK];
    return {
      [AccountType.MOCK]: {
        ...(mockProps ? mockProps : emptyMockAccountProps),
        environments: [
          EnvironmentLabel.MOCK,
        ],
      },
      [AccountType.DEV]: {
        ...props[AccountType.DEV],
        environments: [
          EnvironmentLabel.DEVELOPMENT,
          EnvironmentLabel.FEATURE,
          EnvironmentLabel.TEST,
          EnvironmentLabel.QA,
          EnvironmentLabel.STAGING,
        ],
      },
      [AccountType.PROD]: {
        ...props[AccountType.PROD],
        environments: [
          EnvironmentLabel.PREPRODUCTION,
          EnvironmentLabel.PRODUCTION,
        ],
      },
    };
  }

  /**
   * Enables triple account strategy.
   *
   * 1. `dev` account with environments:
   *    - development
   *    - feature/*
   *    - test
   *    - staging
   * 2. `preprod` account with environments:
   *    - qaN
   *    - preproduction
   * 3. `prod` account with environments:
   *    - production
   *
   * @example
   * Accounts.THREE({
   *   dev: {
   *     id: '111111111111',
   *   },
   *   preprod: {
   *     id: '222222222222',
   *   },
   *   prod: {
   *     id: '333333333333',
   *   },
   * }),
   */
  public static three(props: AccountsThreeProps): Record<string, Account> {
    const mockProps = props[AccountType.MOCK];
    return {
      [AccountType.MOCK]: {
        ...(mockProps ? mockProps : emptyMockAccountProps),
        environments: [
          EnvironmentLabel.MOCK,
        ],
      },
      [AccountType.DEV]: {
        ...props[AccountType.DEV],
        environments: [
          EnvironmentLabel.DEVELOPMENT,
          EnvironmentLabel.FEATURE,
          EnvironmentLabel.TEST,
          EnvironmentLabel.STAGING,
        ],
      },

      [AccountType.PREPROD]: {
        ...props[AccountType.PREPROD],
        environments: [
          EnvironmentLabel.QA,
          EnvironmentLabel.PREPRODUCTION,
        ],
      },

      [AccountType.PROD]: {
        ...props[AccountType.PROD],
        environments: [
          EnvironmentLabel.PRODUCTION,
        ],
      },
    };
  }

}
