import { Account } from '../project';
import { EnvironmentLabel } from './environments';

/**
 * Enumeration of all account types.
 */
export enum AccountType {
  MOCK='mock',
  SHARED='shared',
  DEV='dev',
  PREPROD='preprod',
  PROD='prod',
}

/** Interface for a single account type configuration. */
export interface AccountConfiguration {
  readonly id: string;
  readonly config?: Record<string, any>;
}

/** Props `AccountStrategy.one` */
export interface AccountStrategyOneProps {
  readonly [AccountType.MOCK]?: AccountConfiguration;
  readonly [AccountType.SHARED]: AccountConfiguration;
}

/** Props `AccountStrategy.two` */
export interface AccountStrategyTwoProps {
  readonly [AccountType.MOCK]?: AccountConfiguration;
  readonly [AccountType.DEV]: AccountConfiguration;
  readonly [AccountType.PROD]: AccountConfiguration;
}

/** Props `AccountStrategy.three` */
export interface AccountStrategyThreeProps {
  readonly [AccountType.MOCK]?: AccountConfiguration;
  readonly [AccountType.DEV]: AccountConfiguration;
  readonly [AccountType.PREPROD]: AccountConfiguration;
  readonly [AccountType.PROD]: AccountConfiguration;
}

const emptyMockAccountProps: AccountConfiguration = {
  id: '123456789012',
};

/**
 * Use static methods of `AccountStrategy` abstract class to define your account strategy.
 * Available strategies are:
 * - One Account: `shared`
 * - Two Accounts: `dev`+`prod` – _recommended_
 * - Three Accounts: `dev`+`preprod`+`prod`
 */
export abstract class AccountStrategy {

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
   * AccountStrategy.one({
   *   shared: {
   *     id: '111111111111',
   *   },
   * }),
   */
  public static one(props: AccountStrategyOneProps): Record<string, Account> {
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
   * AccountStrategy.two({
   *   dev: {
   *     id: '111111111111',
   *   },
   *   prod: {
   *     id: '222222222222',
   *   },
   * }),
   */
  public static two(props: AccountStrategyTwoProps): Record<string, Account> {
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
   * AccountStrategy.three({
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
  public static three(props: AccountStrategyThreeProps): Record<string, Account> {
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
