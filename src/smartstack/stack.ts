import { env } from 'process';
import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { ProjectContext } from '../context';
import { getBaseProps } from './baseprops';
import { formatDescription } from './description';
import { formatName } from './name';
import { addTags } from './tags';
import { decideTerminationProtection } from './termination';


export interface SmartStackProps extends StackProps {
  readonly description: string;
}

export class SmartStack extends Stack {
  constructor(scope: Construct, id: string, props: SmartStackProps) {

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
      body: props.description,
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
        ...env, // TODO should we allow override?
        account: accountId,
        region: region,
      },
    });

    addTags(this);
  }
}
