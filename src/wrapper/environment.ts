import { pascalCase } from 'change-case';
import { Construct } from 'constructs';
import { EnvironmentContext } from '../context/environment';

/**
 * Wrapper for environmental stacks.
 */
export class EnvironmentWrapper extends Construct {
  constructor(scope: Construct) {
    if (EnvironmentContext.isValid(scope) !== true) {
      throw new Error('EnvironmentWrapper requires a valid environment to be defined. Provided environment is [' + scope.node.tryGetContext('environment') + ']');
    }
    const type = EnvironmentContext.getName(scope);
    const id = `${pascalCase(type)}Environment`;
    super(scope, id);
  }
}


