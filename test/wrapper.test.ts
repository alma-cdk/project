import { Account, Environment } from './helpers/app';
import { AccountStrategy, PC, Project } from '../src';


describe('Account and Environment wrappers', () => {

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
      },
      prod: {
        id: '222222222222',
      },
    }),
  };

  describe('AccountWrapper', () => {

    test('dev/account', () => {
      const project = new Project(props);
      project.node.setContext('account-type', 'dev');
      const account = new Account(project);
      expect(PC.getAccountType(account)).toBe('dev');
    });

    test('prod/account', () => {
      const project = new Project(props);
      project.node.setContext('account-type', 'prod');
      const account = new Account(project);
      expect(PC.getAccountType(account)).toBe('prod');
    });

  });

  describe('EnvironmentWrapper', () => {

    ['development', 'feature/foo-bar', 'test', 'staging'].forEach((env) => {
      test('dev/environment/with-account', () => {
        const project = new Project(props);
        project.node.setContext('account-type', 'dev');
        project.node.setContext('environment-type', env);
        const environment = new Environment(project);
        expect(PC.getAccountType(environment)).toBe('dev');
        expect(PC.getEnvironment(environment)).toBe(env);
      });

      test('dev/environment/no-account', () => {
        const project = new Project(props);
        project.node.setContext('environment-type', env);
        const environment = new Environment(project);
        expect(PC.getAccountType(environment)).toBe('dev');
        expect(PC.getEnvironment(environment)).toBe(env);
      });
    });

    ['preproduction', 'production'].forEach((env) => {
      test('prod/environment/with-account', () => {
        const project = new Project(props);
        project.node.setContext('account-type', 'prod');
        project.node.setContext('environment-type', env);
        const environment = new Environment(project);
        expect(PC.getAccountType(environment)).toBe('prod');
        expect(PC.getEnvironment(environment)).toBe(env);
      });

      test('prod/environment/no-account', () => {
        const project = new Project(props);
        project.node.setContext('environment-type', env);
        const environment = new Environment(project);
        expect(PC.getAccountType(environment)).toBe('prod');
        expect(PC.getEnvironment(environment)).toBe(env);
      });
    });
  });
});
