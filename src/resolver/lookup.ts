import { getLabelByName } from '../configurations/environments';
import { ProjectConfiguration } from '../project';

type CtxAccount = string;
type CtxEnvironment = string;
type ResultAccount = string;

type WithAccount = Record<CtxAccount, ResultAccount>;
type WithEnvironment = Record<CtxEnvironment, ResultAccount>;
type WithBoth = Record<CtxAccount, WithEnvironment>;

type LookupTable = {
  withAccount: WithAccount;
  withEnvironment: WithEnvironment;
  withBoth: WithBoth;
}

/**
 * Generate a lookup table object from the project configuration.
 * This is used to simplify the lookup of the definite target account name.
 *
 * One can lookup the definite account name by providing either:
 * - the account name (from context)
 * - the environment name (from context)
 * - both account name and environment name (from context)
 *
 * @param config ProjectConfiguration
 * @returns LookupTable to resolve the target account name
 */
export function generateLookupTable(config: ProjectConfiguration): LookupTable {
  const lookupTable: LookupTable = {
    withAccount: {},
    withEnvironment: {},
    withBoth: {},
  };

  Object.keys(config.accounts).forEach((k) => {
    lookupTable.withAccount[k] = k;
    config.accounts[k].environments?.forEach((env) => {
      const label = getLabelByName(env);
      lookupTable.withEnvironment[label] = k;
      lookupTable.withBoth[k] = {
        ...lookupTable.withBoth[k], // merge with existing
        ...{ [label]: k },
      };
    });
  });

  return lookupTable;
}

// TODO separete function to validate project config

/**
 * Get the definite account type from the project configuration.
 *
 * @param config Project Configuration
 * @param ctxAccount Account Name received from context
 * @param ctxEnvironment Environment Name received from context
 * @returns Definite Account Name (that exists in Project Configuration) or undefined if invalid
 */
export function getDefiniteAccountType(config: ProjectConfiguration, ctxAccount?: string, ctxEnvironment?: string): string | undefined {

  const lookup = generateLookupTable(config);

  if (isStringValue(ctxAccount) && isStringValue(ctxEnvironment)) {
    return lookup.withBoth[ctxAccount][getLabelByName(ctxEnvironment)];
  }

  if (isStringValue(ctxEnvironment)) {
    return lookup.withEnvironment[getLabelByName(ctxEnvironment)];
  }

  if (isStringValue(ctxAccount)) {
    return lookup.withAccount[ctxAccount];
  }

  return undefined;

}

function isStringValue(value: any): value is string {
  return typeof value === 'string' && value.length > 0;
}
