import * as cdk from 'aws-cdk-lib';
import { Match } from 'aws-cdk-lib/assertions';
import {
  tagAccount,
  tagEnvironment,
  tagProject,
  tagAuthorName,
  tagAuthorOrganization,
  tagAuthorEmail,
} from './taggers';
import { TestableResource } from './test-helpers/TestableResource';

describe('tagAccount', () => {
  test('no account', () => {
    const testable = new TestableResource();

    tagAccount(testable, cdk.Tags.of(testable), {
      accountType: '', // empty string is considered "no account"
      projectName: '',
      authorName: '',
    });

    testable.hasProperties({
      Tags: Match.absent(),
    });
  });

  test('account specified', () => {
    const testable = new TestableResource();

    tagAccount(testable, cdk.Tags.of(testable), {
      accountType: 'test',
      projectName: '',
      authorName: '',
    });

    testable.hasProperties({
      Tags: [
        {
          Key: 'Account',
          Value: 'test',
        },
      ],
    });
  });
});

describe('tagEnvironment', () => {
  test('no environment', () => {
    const testable = new TestableResource();

    tagEnvironment(testable, cdk.Tags.of(testable), {
      environmentType: '', // empty string is considered "no environment"
      projectName: '',
      authorName: '',
    });

    testable.hasProperties({
      Tags: Match.absent(),
    });
  });

  test('environment specified', () => {
    const testable = new TestableResource();

    tagEnvironment(testable, cdk.Tags.of(testable), {
      environmentType: 'test',
      projectName: '',
      authorName: '',
    });

    testable.hasProperties({
      Tags: [
        {
          Key: 'Environment',
          Value: 'test',
        },
      ],
    });
  });

  test('legacy mode adds also ProjectAndEnvironment tag', () => {
    const testable = new TestableResource({
      context: {
        '@alma-cdk/project:legacyTags': true,
      },
    });

    tagEnvironment(testable, cdk.Tags.of(testable), {
      environmentType: 'test',
      projectName: 'my-project',
      authorName: '',
    });

    testable.hasProperties({
      Tags: [
        {
          Key: 'Environment',
          Value: 'test',
        },
        {
          Key: 'ProjectAndEnvironment',
          Value: 'MyProjectTest',
        },
      ],
    });
  });
});

describe('tagProject', () => {
  test('no project', () => {
    const testable = new TestableResource();

    tagProject(testable, cdk.Tags.of(testable), {
      projectName: '',
      authorName: '',
    });

    testable.hasProperties({
      Tags: [
        {
          Key: 'Project',
          Value: '', // existing behavior accepts empty string for Project
        },
      ],
    });
  });

  test('project specified', () => {
    const testable = new TestableResource();

    tagProject(testable, cdk.Tags.of(testable), {
      projectName: 'my-project',
      authorName: '',
    });

    testable.hasProperties({
      Tags: [
        {
          Key: 'Project',
          Value: 'my-project',
        },
      ],
    });
  });

  test('legacy mode converts to Capital Case', () => {
    const testable = new TestableResource({
      context: {
        '@alma-cdk/project:legacyTags': true,
      },
    });

    tagProject(testable, cdk.Tags.of(testable), {
      projectName: 'my-project',
      authorName: '',
    });

    testable.hasProperties({
      Tags: [
        {
          Key: 'Project',
          Value: 'My Project',
        },
      ],
    });
  });
});

test('tagAuthorName', () => {
  const testable = new TestableResource();

  tagAuthorName(testable, cdk.Tags.of(testable), {
    authorName: 'test',
    projectName: '',
    authorEmail: '',
  });

  testable.hasProperties({
    Tags: [
      {
        Key: 'Author',
        Value: 'test',
      },
    ],
  });
});

describe('tagAuthorOrganization', () => {
  test('compatibility mode not set', () => {
    const testable = new TestableResource();

    tagAuthorOrganization(testable, cdk.Tags.of(testable), {
      authorOrganization: 'test',
      projectName: '',
      authorName: '',
    });

    testable.hasProperties({
      Tags: [
        {
          Key: 'Organization',
          Value: 'test',
        },
      ],
    });
  });

  test('compatibility mode is set but disabled', () => {
    const testable = new TestableResource({
      context: {
        '@alma-cdk/project:compatibility:v0:tags': false,
      },
    });

    tagAuthorOrganization(testable, cdk.Tags.of(testable), {
      authorOrganization: 'test',
      projectName: '',
      authorName: '',
    });

    testable.hasProperties({
      Tags: [
        {
          Key: 'Organization',
          Value: 'test',
        },
      ],
    });
  });

  test('compatibility mode is set', () => {
    const testable = new TestableResource({
      context: {
        '@alma-cdk/project:compatibility:v0:tags': true,
      },
    });

    tagAuthorOrganization(testable, cdk.Tags.of(testable), {
      authorOrganization: 'test',
      projectName: '',
      authorName: '',
    });

    testable.hasProperties({
      Tags: Match.absent(),
    });
  });
});

describe('tagAuthorEmail', () => {
  test('compatibility mode not set', () => {
    const testable = new TestableResource();

    tagAuthorEmail(testable, cdk.Tags.of(testable), {
      authorEmail: 'test@example.com',
      projectName: '',
      authorName: '',
    });

    testable.hasProperties({
      Tags: [
        {
          Key: 'Contact',
          Value: 'test@example.com',
        },
      ],
    });
  });

  test('compatibility mode is set but disabled', () => {
    const testable = new TestableResource({
      context: {
        '@alma-cdk/project:compatibility:v0:tags': false,
      },
    });

    tagAuthorEmail(testable, cdk.Tags.of(testable), {
      authorEmail: 'test@example.com',
      projectName: '',
      authorName: '',
    });

    testable.hasProperties({
      Tags: [
        {
          Key: 'Contact',
          Value: 'test@example.com',
        },
      ],
    });
  });

  test('compatibility mode is set', () => {
    const testable = new TestableResource({
      context: {
        '@alma-cdk/project:compatibility:v0:tags': true,
      },
    });

    tagAuthorEmail(testable, cdk.Tags.of(testable), {
      authorEmail: 'test@example.com',
      projectName: '',
      authorName: '',
    });

    testable.hasProperties({
      Tags: Match.absent(),
    });
  });
});
