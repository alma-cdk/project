import { env } from 'process';
import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { ProjectContext } from '../context';
import { addError } from '../error/add';
import { formatDescription } from './description';
import { formatName } from './name';
import { addTags } from './tags';
import { decideTerminationProtection } from './termination';


export class SmartStack extends Stack {

  private readonly descriptionMinLength: number = 12;
  private readonly descriptionMaxLength: number = 280;

  constructor(scope: Construct, id: string, props: StackProps) {

    // TypeScript rule TS2376 requires that super must be the first call in a
    // derivative class. Hence we must resolve values "inline" within inside the
    // super call:
    // https://github.com/microsoft/TypeScript/issues/8277
    // https://github.com/microsoft/TypeScript/issues/945
    super(scope, id, {

      // Set the Stack "base props" (most of them will be overriden below)
      ...props,

      stackName: formatName({
        override: props?.stackName,
        stackId: id,
        projectName: ProjectContext.getName(scope),
        accountType: ProjectContext.getAccountType(scope),
        environmentType: ProjectContext.tryGetEnvironment(scope) || '',
      }),

      description: formatDescription({
        body: props.description!,
        accountType: ProjectContext.getAccountType(scope),
        environmentType: ProjectContext.tryGetEnvironment(scope) || '',
      }),

      terminationProtection: decideTerminationProtection({
        override: props?.terminationProtection,
        environmentType: ProjectContext.tryGetEnvironment(scope) || '',
      }),

      env: {
        ...env, // for future-proofing purposes in case CDK adds new fields
        account: props?.env?.account || ProjectContext.getAccountId(scope),
        region: props?.env?.region || ProjectContext.getDefaultRegion(scope),
      },
    });

    this.validateDescriptionMinLength(props);
    this.validateDescriptionMaxLength(props);


    addTags(this);
  }

  private validateDescriptionMinLength(props: StackProps) {
    if (typeof props.description !== 'string' || props.description.length < this.descriptionMinLength) {
      addError(this, `Description is required and should be at least ${this.descriptionMinLength} characters`);
    }
  }

  private validateDescriptionMaxLength(props: StackProps) {
    if (typeof props.description === 'string' && props.description.length > this.descriptionMaxLength) {
      addError(this, `Description is should be at max ${this.descriptionMaxLength} characters`);
    }
  }
}
