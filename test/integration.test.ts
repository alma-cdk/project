import { RemovalPolicy, StackProps } from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as events from 'aws-cdk-lib/aws-events';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import { Construct } from 'constructs';

import { Project, Accounts, EnvironmentWrapper, SmartStack, EC, Name, PathName, UrlName } from '../src';


class MyStack extends SmartStack {
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
  }
}

class Environment extends EnvironmentWrapper {
  constructor(scope: Construct) {
    super(scope);
  }
}

interface TagValue {
  Key: string;
  Value: string;
}

const expectedTags: TagValue[] = [
  {
    Key: 'Account',
    Value: 'dev',
  },
  {
    Key: 'Author',
    Value: 'Mad Scientists',
  },
  {
    Key: 'Environment',
    Value: 'development',
  },
  {
    Key: 'Project',
    Value: 'my-cool-project',
  },
];

function sortTagsByKey(tags: TagValue[]): TagValue[] {
  return tags.sort((a, b) => a.Key.localeCompare(b.Key));
}

function tagsAsDictionary(tags: TagValue[]): { [key: string]: string } {
  return tags.reduce((acc: any, tag) => {
    acc[tag.Key] = tag.Value;
    return acc;
  }, {});
}


describe('Integration', () => {

  test('should work', () => {

    const project = new Project({
      // Basic info, you could also read these from package.json if you want
      name: 'my-cool-project',
      author: {
        organization: 'Acme Corp',
        name: 'Mad Scientists',
        email: 'mad.scientists@acme.example.com',
      },
      // If not set, defaults to one of: $CDK_DEFAULT_REGION, $AWS_REGION or us-east-1
      defaultRegion: 'eu-west-1',
      // Configures the project to use 2 AWS accounts (recommended)
      accounts: Accounts.two({
        dev: {
          id: '111111111111',
          config: {
            // whatever you want here as [string]: any
            baseDomain: 'example.net',
          },
        },
        prod: {
          id: '222222222222',
          config: {
            // whatever you want here as [string]: any
            baseDomain: 'example.com',
          },
        },
      }),
      context: {
        account: 'dev',
        environment: 'development',
      },
    });

    const environment = new Environment(project);

    const myStack = new MyStack(environment, 'MyStack', { description: 'This is required' });

    expect(myStack.stackName).toBe('MyCoolProject-Development-Environment-MyStack');

    const template = Template.fromStack(myStack);

    template.hasResourceProperties(
      'AWS::DynamoDB::Table',
      Match.objectLike({
        AttributeDefinitions: [
          {
            AttributeName: 'pk',
            AttributeType: 'S',
          },
        ],
        TableName: 'DevelopmentMyTable',
        Tags: expectedTags,
      }),
    );

    template.hasResourceProperties(
      'AWS::Events::EventBus',
      Match.objectLike({
        Name: 'MyCoolProjectDevelopmentMyEventBus',
        // TODO why not present? Tags: expectedTags,
      }),
    );

    template.hasResourceProperties(
      'AWS::S3::Bucket',
      Match.objectLike({
        BucketName: 'acme-corp-my-cool-project-development-my-bucket',
        Tags: Match.arrayWith(sortTagsByKey([
          ...expectedTags,
          {
            Key: 'aws-cdk:auto-delete-objects',
            Value: 'true',
          },
        ])),
      }),
    );

    template.hasResourceProperties(
      'AWS::SSM::Parameter',
      Match.objectLike({
        Type: 'String',
        Value: 'Foo',
        Name: '/my/cool/project/development/MyNamespace/MyParameter',
        Tags: tagsAsDictionary(expectedTags),
        Tier: 'Advanced',
      }),
    );
  });

});

