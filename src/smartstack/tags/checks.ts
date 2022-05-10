import { Construct } from 'constructs';
import { isSet } from '../../utils/isSet';
import { Values } from './values';

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
