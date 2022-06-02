import { pascalCase } from 'change-case';
import { Construct } from 'constructs';
import { EnvironmentContext } from '../context/environment';

export class EnvironmentWrapper extends Construct {
  constructor(scope: Construct) {
    const type = EnvironmentContext.getName(scope);
    const id = `${pascalCase(type)}Environment`;
    super(scope, id);
  }
}


