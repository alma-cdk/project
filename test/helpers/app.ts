import { RemovalPolicy, StackProps } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as events from 'aws-cdk-lib/aws-events';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import { Construct } from 'constructs';
import { Project, EnvironmentWrapper, SmartStack, EC, Name, PathName, UrlName, ProjectProps, AC, AccountWrapper } from '../../src';


export class MyStack extends SmartStack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    new dynamodb.Table(this, 'Table', {
      removalPolicy: EC.isStable(this) ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY,

      tableName: Name.it(this, 'MyTable'),
      partitionKey: {
        type: dynamodb.AttributeType.STRING,
        name: 'pk',
      },
      // StagingMyTable
    });

    new events.EventBus(this, 'EventBus', {
      eventBusName: Name.withProject(this, 'MyEventBus'),
      // MyCoolProjectStagingMyEventBus
    });

    new s3.Bucket(this, 'Bucket', {

      removalPolicy: EC.isStable(this) ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY,
      autoDeleteObjects: EC.isStable(this) ? false : true,

      bucketName: UrlName.globally(this, 'MyBucket'),
      // acme-corp-my-cool-project-feature-foo-bar-my-bucket
    });

    new ssm.StringParameter(this, 'Parameter', {
      stringValue: 'Foo',
      tier: ssm.ParameterTier.ADVANCED,
      parameterName: PathName.withProject(this, 'MyNamespace/MyParameter'),
      // /MyCoolProject/Staging/MyNamespace/MyParameter
    });

    new route53.HostedZone(this, 'Zone', {
      zoneName: AC.getAccountConfig(this, 'baseDomain'),
    });

  }
}

export class Environment extends EnvironmentWrapper {
  constructor(scope: Construct) {
    super(scope);
  }
}

export class Account extends AccountWrapper {
  constructor(scope: Construct) {
    super(scope);
  }
}

export interface TestApp {
  project: Project;
  environment: Environment;
  stack: SmartStack;
  template: Template;
}

export function generateTestApp(props: ProjectProps): TestApp {
  const project = new Project(props);
  const environment = new Environment(project);
  const stack = new MyStack(environment, 'TestStack', { description: 'This is required' });
  const template = Template.fromStack(stack);

  return {
    project,
    environment,
    stack,
    template,
  };
}
