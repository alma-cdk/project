import { env } from 'process';
import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { ProjectContext } from '../context';
import { getBaseProps } from './baseprops';
import { formatDescription } from './description';
import { formatName } from './name';
import { addTags } from './tags';
import { decideTerminationProtection } from './termination';
import { addError } from '../error/add';


export class SmartStack extends Stack {

  private readonly descriptionMinLength: number = 12;
  private readonly descriptionMaxLength: number = 280;

  constructor(scope: Construct, id: string, props: StackProps) {

    const baseProps = getBaseProps(props);
    const accountId = props?.env?.account || ProjectContext.getAccountId(scope);
    const region = props?.env?.region || ProjectContext.getDefaultRegion(scope);
    const accountType = ProjectContext.getAccountType(scope);
    const environmentType = ProjectContext.tryGetEnvironment(scope) || '';
    const projectName = ProjectContext.getName(scope);

    const stackName = formatName({
      override: props?.stackName,
      stackId: id,
      projectName,
      accountType,
      environmentType,
    });

    const description = formatDescription({
      body: props.description!,
      accountType,
      environmentType,
    });

    const terminationProtection = decideTerminationProtection({
      override: props?.terminationProtection,
      environmentType,
    });

    super(scope, id, {
      ...baseProps,
      stackName,
      terminationProtection,
      description,
      env: {
        ...env, // for future-proofing purposes in case CDK adds new fields
        account: accountId,
        region: region,
      },
    });

    this.validateDescriptionMinLength(props);
    this.validateDescriptionMaxLength(props);


    addTags(this);
  }

  private validateDescriptionMinLength(props: StackProps) {
    if (typeof props.description !== 'string' || props.description.length < this.descriptionMinLength) {
      addError(this, `Description is required and should be at least ${this.descriptionMinLength} characters`)
    }
  }

  private validateDescriptionMaxLength(props: StackProps) {
    if (typeof props.description === 'string' && props.description.length > this.descriptionMaxLength) {
      addError(this, `Description is should be at max ${this.descriptionMaxLength} characters`)
    }
  }
}
