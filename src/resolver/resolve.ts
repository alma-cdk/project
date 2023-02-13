import { Construct } from 'constructs';
import { getDefiniteAccountName } from './lookup';
import { EnvironmentCategory, EnvironmentLabel } from '../configurations';
import { getCategoryByLabel, getLabelByName } from '../configurations/environments';
import { ProjectConfiguration } from '../project';
import { getCtxAccount, getCtxEnvironment } from '../runtime-ctx';

/**
 * Resolved Account and Environment information.
 */
export interface Resolved<T extends Record<string, any>> {
  readonly account: {
    readonly id: string;
    readonly config: T;
  };
  readonly environment?: {
    readonly name: string;
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
 * @returns Resolved Account and Environment information
 */
export function resolve(scope: Construct, config: ProjectConfiguration): Resolved<any> {

  const ctxAccount = getCtxAccount(scope);
  const ctxEnvironment = getCtxEnvironment(scope);

  const accountName = getDefiniteAccountName(config, ctxAccount, ctxEnvironment);

  const account = {
    id: config.accounts[accountName].id,
    config: config.accounts[accountName].config,
  };

  if (typeof ctxEnvironment === 'undefined') {
    return {
      account,
    };
  }

  return {
    account,
    environment: {
      name: ctxEnvironment,
      label: getLabelByName(ctxEnvironment),
      category: getCategoryByLabel(getLabelByName(ctxEnvironment)),
    },
  };
}
