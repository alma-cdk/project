import { EnvironmentContext } from '.';
import { AccountStrategy } from '../configurations';
import { Project, ProjectProps } from '../project';

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

describe('EnvironmentContext', () => {

  test('Environment test is valid', () => {
    const project = new Project({
      ...projectProps,
      context: {
        account: 'shared',
        environment: 'test',
      },
    });

    expect(EnvironmentContext.isValid(project)).toBeTruthy();

  });

  test('Environment dilledong is invalid', () => {
    const project = new Project({
      ...projectProps,
      context: {
        account: 'shared',
        environment: 'dilledong',
      },
    });

    expect(EnvironmentContext.isValid(project)).toBeFalsy();

  });


  test('Undefined environment is invalid', () => {
    const project = new Project({
      ...projectProps,
      context: {
        account: 'shared',
      },
    });

    expect(EnvironmentContext.isValid(project)).toBeFalsy();

  });

});
