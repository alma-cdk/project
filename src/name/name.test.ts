import * as cdk from 'aws-cdk-lib';
//import { Construct } from 'constructs';
import { Name, name } from '.';
import { Project, ProjectProps } from '../project';

const projectProps: ProjectProps = {
  name: 'test-project',
  author: {
    organization: 'Acme',
    name: 'Test Author',
    email: 'test@example.com',
  },
  accounts: {},
};

describe('Name resources', () => {

  test('Produce valid environmental output with "it"', () => {
    const project = new Project({
      ...projectProps,
      context: {
        environment: 'test',
      },
    });

    const stack = new cdk.Stack(project, 'testing-stack');

    const expected = 'TestFooBar';
    expect(Name.it(stack, 'fooBar')).toBe(expected);
    expect(Name.it(stack, 'foo-bar')).toBe(expected);
    expect(Name.it(stack, 'foo bar')).toBe(expected);
    expect(Name.it(stack, 'foo.bar')).toBe(expected);
  });

  test('Produce valid non-environmental output with "withProject"', () => {
    const project = new Project({ ...projectProps });

    const stack = new cdk.Stack(project, 'testing-stack');

    const expected = 'TestProjectFooBar';
    expect(Name.withProject(stack, 'fooBar')).toBe(expected);
    expect(Name.withProject(stack, 'foo-bar')).toBe(expected);
    expect(Name.withProject(stack, 'foo bar')).toBe(expected);
    expect(Name.withProject(stack, 'foo.bar')).toBe(expected);
  });

  test('Produce valid environmental output with "withProject"', () => {
    const project = new Project({
      ...projectProps,
      context: {
        environment: 'test',
      },
    });

    const stack = new cdk.Stack(project, 'testing-stack');

    const expected = 'TestProjectTestFooBar';
    expect(Name.withProject(stack, 'fooBar')).toBe(expected);
    expect(Name.withProject(stack, 'foo-bar')).toBe(expected);
    expect(Name.withProject(stack, 'foo bar')).toBe(expected);
    expect(Name.withProject(stack, 'foo.bar')).toBe(expected);
  });

  test('Produce valid environmental output with "globally"', () => {
    const project = new Project({
      ...projectProps,
      context: {
        environment: 'test',
      },
    });

    const stack = new cdk.Stack(project, 'testing-stack');

    const expected = 'AcmeTestProjectTestFooBar';
    expect(Name.globally(stack, 'fooBar')).toBe(expected);
    expect(Name.globally(stack, 'foo-bar')).toBe(expected);
    expect(Name.globally(stack, 'foo bar')).toBe(expected);
    expect(Name.globally(stack, 'foo.bar')).toBe(expected);
  });

  test('shorthand method', () => {
    const project = new Project({
      ...projectProps,
      context: {
        environment: 'test',
      },
    });

    const stack = new cdk.Stack(project, 'testing-stack');

    const input = 'fooBar';
    const expected = 'TestProjectTestFooBar';
    const explicit = Name.withProject(stack, input);
    expect(explicit).toBe(expected);
    expect(name(stack, input)).toBe(expected);
  });

});
