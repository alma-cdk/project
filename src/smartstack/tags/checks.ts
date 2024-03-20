import { Construct } from 'constructs';
import { Values } from './values';
import { isNonEmptyString } from '../../utils/isSet';

export function hasAccount(values: Values): boolean {
  return isNonEmptyString(values.accountType);
}

export function hasEnvironment(values: Values): boolean {
  return isNonEmptyString(values.environmentType);
}

export function useLegacyTags(scope: Construct): boolean {
  const contextKey = '@alma-cdk/project:legacyTags';
  return scope.node.tryGetContext(contextKey) === true;
}
