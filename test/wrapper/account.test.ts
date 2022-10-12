import { Construct } from 'constructs';
import { AccountStrategy, AccountWrapper, Project, ProjectProps, SmartStack } from '../../src';

const projectProps: ProjectProps = {
  name: 'test-project',
  author: {
    organization: 'Acme',
    name: 'Test Author',
    email: 'test@example.com',
  },
  accounts: AccountStrategy.one({
    shared: {
      id: '123456789012',
    },
  }),
};

export class MockAccount extends AccountWrapper {

  constructor(scope: Construct) {
    super(scope);
  }
};

describe('Account stack initialized in context specifying only account', () => {
  let stack: SmartStack;

  beforeAll(() => {
    const project = new Project({
      ...projectProps,
      context: {
        account: 'shared',
      },
    });
    const account = new MockAccount(project);
    stack = new SmartStack(account, 'TestStack', { description: 'Test stack' });
  });

  test('Stack name is account wide', () => {
    expect(stack.stackName).toBe('TestProject-Account-TestStack');
  });
});

describe('Account stack initialized in context specifying account and environment', () => {
  let stack: SmartStack;

  beforeAll(() => {
    const project = new Project({
      ...projectProps,
      context: {
        account: 'shared',
        environment: 'development',
      },
    });
    const account = new MockAccount(project);
    stack = new SmartStack(account, 'TestStack', { description: 'Test stack' });
  });

  test('Stack name is account wide', () => {
    expect(stack.stackName).toBe('TestProject-Account-TestStack');
  });
});
