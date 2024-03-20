import { Match } from 'aws-cdk-lib/assertions';
import { generateTestApp } from './helpers/app';
import { sortTagsByKey, tagsAsDictionary, TagValue } from './helpers/tags';
import { AccountStrategy, PC } from '../src';


describe('Integration', () => {

  describe('Accounts: Two', () => {
    const props = {
      name: 'my-cool-project',
      author: {
        organization: 'Acme Corp',
        name: 'Mad Scientists',
        email: 'mad.scientists@acme.example.com',
      },
      defaultRegion: 'eu-west-1',
      accounts: AccountStrategy.two({
        dev: {
          id: '111111111111',
          config: {
            baseDomain: 'example.net',
            sizing: {
              staging: {
                cpu: 256,
                memory: 512,
              },
            },
            flags: [
              'foo',
              'bar',
            ],
          },
        },
        prod: {
          id: '222222222222',
          config: {
            baseDomain: 'example.com',
            sizing: {
              production: {
                cpu: 1024,
                memory: 4096,
              },
            },
            flags: [
              'foo',
              'bar',
            ],
          },
        },
      }),
    };

    test('dev/development', () => {

      const {
        stack,
        template,
      } = generateTestApp({
        ...props,
        context: {
          account: 'dev',
          environment: 'development',
        },
      });

      expect(stack.stackName).toBe('MyCoolProject-Environment-Development-TestStack');
      expect(stack.terminationProtection).toBeFalsy();
      expect(stack.region).toBe('eu-west-1');

      const expectedTags: TagValue[] = [
        { Key: 'Account', Value: 'dev' },
        { Key: 'Author', Value: 'Mad Scientists' },
        { Key: 'Environment', Value: 'development' },
        { Key: 'Project', Value: 'my-cool-project' },
      ];

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
          Tags: Match.arrayWith(expectedTags),
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

      template.hasResourceProperties(
        'AWS::Route53::HostedZone',
        Match.objectLike({
          Name: 'example.net.',
          HostedZoneTags: Match.arrayWith(expectedTags),
        }),
      );
    });

    test('dev/feature/abc-123', () => {

      const {
        stack,
        template,
      } = generateTestApp({
        ...props,
        context: {
          account: 'dev',
          environment: 'feature/abc-123',
        },
      });

      expect(stack.stackName).toBe('MyCoolProject-Environment-FeatureAbc123-TestStack');
      expect(stack.terminationProtection).toBeFalsy();
      expect(stack.region).toBe('eu-west-1');

      const expectedTags: TagValue[] = [
        { Key: 'Account', Value: 'dev' },
        { Key: 'Author', Value: 'Mad Scientists' },
        { Key: 'Environment', Value: 'feature/abc-123' },
        { Key: 'Project', Value: 'my-cool-project' },
      ];

      template.hasResourceProperties(
        'AWS::DynamoDB::Table',
        Match.objectLike({
          AttributeDefinitions: [
            {
              AttributeName: 'pk',
              AttributeType: 'S',
            },
          ],
          TableName: 'FeatureAbc123MyTable',
          Tags: Match.arrayWith(expectedTags),
        }),
      );

      template.hasResourceProperties(
        'AWS::Events::EventBus',
        Match.objectLike({
          Name: 'MyCoolProjectFeatureAbc123MyEventBus',
          // TODO why not present? Tags: expectedTags,
        }),
      );

      template.hasResourceProperties(
        'AWS::S3::Bucket',
        Match.objectLike({
          BucketName: 'acme-corp-my-cool-project-feature-abc123-my-bucket',
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
          Name: '/my/cool/project/feature/abc123/MyNamespace/MyParameter',
          Tags: tagsAsDictionary(expectedTags),
          Tier: 'Advanced',
        }),
      );

      template.hasResourceProperties(
        'AWS::Route53::HostedZone',
        Match.objectLike({
          Name: 'example.net.',
          HostedZoneTags: Match.arrayWith(expectedTags),
        }),
      );
    });

    test('prod/production', () => {

      const {
        stack,
        template,
      } = generateTestApp({
        ...props,
        context: {
          account: 'prod',
          environment: 'production',
        },
      });

      expect(stack.stackName).toBe('MyCoolProject-Environment-Production-TestStack');
      expect(stack.terminationProtection).toBeTruthy();
      expect(stack.region).toBe('eu-west-1');

      const expectedTags: TagValue[] = [
        { Key: 'Account', Value: 'prod' },
        { Key: 'Author', Value: 'Mad Scientists' },
        { Key: 'Environment', Value: 'production' },
        { Key: 'Project', Value: 'my-cool-project' },
      ];

      template.hasResourceProperties(
        'AWS::DynamoDB::Table',
        Match.objectLike({
          AttributeDefinitions: [
            {
              AttributeName: 'pk',
              AttributeType: 'S',
            },
          ],
          TableName: 'ProductionMyTable',
          Tags: Match.arrayWith(expectedTags),
        }),
      );

      template.hasResourceProperties(
        'AWS::Events::EventBus',
        Match.objectLike({
          Name: 'MyCoolProjectProductionMyEventBus',
          // TODO why not present? Tags: expectedTags,
        }),
      );

      template.hasResourceProperties(
        'AWS::S3::Bucket',
        Match.objectLike({
          BucketName: 'acme-corp-my-cool-project-production-my-bucket',
          Tags: Match.arrayWith(expectedTags),
        }),
      );

      template.hasResourceProperties(
        'AWS::SSM::Parameter',
        Match.objectLike({
          Type: 'String',
          Value: 'Foo',
          Name: '/my/cool/project/production/MyNamespace/MyParameter',
          Tags: tagsAsDictionary(expectedTags),
          Tier: 'Advanced',
        }),
      );

      template.hasResourceProperties(
        'AWS::Route53::HostedZone',
        Match.objectLike({
          Name: 'example.com.',
          HostedZoneTags: Match.arrayWith(expectedTags),
        }),
      );
    });

    test('dev/config', () => {

      const {
        stack,
      } = generateTestApp({
        ...props,
        context: {
          account: 'dev',
          environment: 'development',
        },
      });

      expect(PC.getAccountConfig(stack, 'baseCamp', 'no camping')).toBe('no camping');
      expect(PC.getAccountConfig(stack, 'baseDomain')).toBe('example.net');
      expect(PC.getAccountConfig(stack, 'sizing.staging.cpu')).toBe(256);
      expect(PC.getAccountConfig(stack, 'sizing.test.cpu', 256)).toBe(256);
      expect(PC.getAccountConfig(stack, 'flags[0]')).toBe('foo');
    });

    test('prod/config', () => {

      const {
        stack,
      } = generateTestApp({
        ...props,
        context: {
          account: 'prod',
          environment: 'production',
        },
      });

      expect(PC.getAccountConfig(stack, 'baseCamp', 'no camping')).toBe('no camping');
      expect(PC.getAccountConfig(stack, 'baseDomain')).toBe('example.com');
      expect(PC.getAccountConfig(stack, 'sizing.production.cpu')).toBe(1024);
      expect(PC.getAccountConfig(stack, 'sizing.preproduction.cpu', 512)).toBe(512);
      expect(PC.getAccountConfig(stack, 'flags[0]')).toBe('foo');
    });

  });

});
