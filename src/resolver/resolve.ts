import { Construct } from 'constructs';
import memoize from 'fast-memoize';
import { getDefiniteAccountType } from './lookup';
import { EnvironmentCategory, EnvironmentLabel } from '../configurations';
import { getCategoryByLabel, getLabelByName } from '../configurations/environments';
import { ProjectConfiguration } from '../project';
import { getCtxAccount, getCtxEnvironment } from '../runtime-ctx';

const mGetDefiniteAccountType = memoize(getDefiniteAccountType);

/**
 * Resolved Account and Environment information.
 */
export interface Resolved<T extends Record<string, any>> {
  readonly account: {
    readonly type: string;
    readonly id: string;
    readonly config: T;
  };
  readonly environment?: {
    readonly type: string;
    readonly label: EnvironmentLabel;
    readonly category: EnvironmentCategory;
  };
}


/**
 * Resolve Account and Environment information based on the Project Configuration
 * and runtime context.
 *
 * @param scope Construct Scope
 * @param config Project Configuration
 * @returns Resolved Account & Environment information or undefined if invalid configration
 */
export function resolveTarget(scope: Construct, config: ProjectConfiguration): Resolved<any> | undefined {

  const ctxAccount = getCtxAccount(scope);
  const ctxEnvironment = getCtxEnvironment(scope);

  const accountType = mGetDefiniteAccountType(config, ctxAccount, ctxEnvironment);

  if (typeof accountType !== 'string') {
    return undefined;
  }

  const account = {
    type: accountType,
    id: config.accounts[accountType].id,
    config: config.accounts[accountType].config,
  };

  if (typeof ctxEnvironment === 'undefined') {
    return {
      account,
    };
  }

  return {
    account,
    environment: {
      type: ctxEnvironment,
      label: getLabelByName(ctxEnvironment),
      category: getCategoryByLabel(getLabelByName(ctxEnvironment)),
    },
  };
}
