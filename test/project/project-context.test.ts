import {
  AccountStrategy,
  AccountWrapper,
  EnvironmentContext,
  EnvironmentWrapper,
  Project,
  ProjectContext,
  ProjectProps,
} from '../../src';

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

describe('ProjectContext', () => {

  test('Environment should be undefined in AccountWrapper scope when environment not specified in context', () => {
    let accountWrapper = new AccountWrapper(new Project({
      ...projectProps,
      context: {
        account: 'shared',
      },
    }));
    expect(accountWrapper.node.tryGetContext('environment')).toBeUndefined();
    expect(ProjectContext.tryGetEnvironment(accountWrapper)).toBeUndefined();
  });

  test('Environment should be undefined in AccountWrapper scope even when environment is specified in context', () => {
    let accountWrapper = new AccountWrapper(new Project({
      ...projectProps,
      context: {
        account: 'shared',
        environment: 'development',
      },
    }));
    expect(ProjectContext.tryGetEnvironment(accountWrapper)).toBeUndefined();
  });

  test('AccountWrapper.node.tryGetContext for environment variables returns the environment from AccountWrapper parent scope when environment is specified in context', () => {
    let accountWrapper = new AccountWrapper(new Project({
      ...projectProps,
      context: {
        account: 'shared',
        environment: 'development',
      },
    }));
    expect(accountWrapper.node.tryGetContext('environment-type')).toBeUndefined();
    expect(accountWrapper.node.tryGetContext('env')).toBeUndefined();
    // Constructs tryGetContext implementation is such that it gets the value from "super" scope, which is Project int this case
    // tryGetContext(key) {
    //         const value = this._context[key];
    //         if (value !== undefined) {
    //             return value;
    //         }
    //         return this.scope && this.scope.node.tryGetContext(key);
    //     }
    expect(accountWrapper.node.tryGetContext('environment')).toEqual('development');
  });

  test('An error should be thrown when environment not specified in context provided to EnvironmentWrapper', () => {
    try {
      let environmentWrapper = new EnvironmentWrapper(new Project({
        ...projectProps,
        context: {
          account: 'shared',
        },
      }));
      let environmentCategory = EnvironmentContext.getCategory(environmentWrapper);
      expect(environmentCategory).toBeUndefined();
      ProjectContext.tryGetEnvironment(environmentWrapper);
      throw new Error('Should have failed already');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error).toHaveProperty('message', 'EnvironmentWrapper requires a valid environment to be defined. Provided environment is [undefined]');
    }
  });

  test('Environment should be defined in EnvironmentWrapper scope when environment is specified in context', () => {
    let environmentWrapper = new EnvironmentWrapper(new Project({
      ...projectProps,
      context: {
        account: 'shared',
        environment: 'development',
      },
    }));
    expect(environmentWrapper.node.tryGetContext('environment')).toEqual('development');
    expect(ProjectContext.tryGetEnvironment(environmentWrapper)).toEqual('development');
  });
});
