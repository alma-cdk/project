import { Construct } from 'constructs';
import { Values } from './values';
import { isSet } from '../../utils/isSet';

export function hasAccount(values: Values): boolean {
  return isSet(values.accountType);
}

export function hasEnvironment(values: Values): boolean {
  return isSet(values.environmentType);
}

export function useLegacyTags(scope: Construct): boolean {
  const contextKey = '@alma-cdk/project:legacyTags';
  return scope.node.tryGetContext(contextKey) === true;
}
