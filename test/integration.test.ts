import { Match } from 'aws-cdk-lib/assertions';
import { Accounts } from '../src';
import { generateTestApp } from './helpers/app';
import { sortTagsByKey, tagsAsDictionary, TagValue } from './helpers/tags';


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
      accounts: Accounts.two({
        dev: {
          id: '111111111111',
          config: {
            baseDomain: 'example.net',
          },
        },
        prod: {
          id: '222222222222',
          config: {
            baseDomain: 'example.com',
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

      expect(stack.stackName).toBe('MyCoolProject-Development-Environment-TestStack');
      expect(stack.terminationProtection).toBeFalsy();

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

      expect(stack.stackName).toBe('MyCoolProject-Production-Environment-TestStack');
      expect(stack.terminationProtection).toBeTruthy();

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
          Tags: expectedTags,
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
          Tags: expectedTags,
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
    });

  });

});
