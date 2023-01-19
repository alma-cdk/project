import { AccountStrategy, EnvironmentWrapper, Project, ProjectContext, ProjectProps } from '../../src';

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

describe('EnvironmentWrapper', () => {


  test('An error should be thrown when environment not specified in context provided to EnvironmentWrapper', () => {
    try {
      new EnvironmentWrapper(new Project({
        ...projectProps,
        context: {
          account: 'shared',
        },
      }));
      throw new Error('Should have failed already');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error).toHaveProperty('message', 'EnvironmentWrapper requires a valid environment to be defined. Provided environment is [undefined]');
    }
  });

  test('An error should be thrown when an invalid environment name is specified in context provided to EnvironmentWrapper', () => {
    try {
      new EnvironmentWrapper(new Project({
        ...projectProps,
        context: {
          account: 'shared',
          environment: 'dilledong',
        },
      }));
      throw new Error('Should have failed already');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error).toHaveProperty('message', 'EnvironmentWrapper requires a valid environment to be defined. Provided environment is [dilledong]');
    }
  });

  test('EnvironmentWrapper is successfully initialized when a valid environment name is specified', () => {
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
