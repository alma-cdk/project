import { formatName, NameProps } from './index';

interface testCase {
  readonly name: string;
  readonly input: NameProps;
  readonly expected: string;
}

function runTest(tc: testCase): void {
  test(tc.name, function(): void {
    const actual = formatName(tc.input);
    const expected = tc.expected;
    expect(typeof actual).toBe('string');
    expect(actual.length).toBeLessThanOrEqual(128);
    expect(actual).toBe(expected);
  });
}

function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

describe('SmartStack', () => {
  describe('stackName', () => {
    [
      {
        name: 'with override',
        input: {
          override: 'this-should-win',
          projectName: 'my-project',
          accountType: 'mock',
          environmentType: 'testing',
          stackId: 'my-stack',
        },
        expected: 'this-should-win',
      },
      {
        name: 'all values',
        input: {
          projectName: 'my-project',
          accountType: 'mock',
          environmentType: 'testing',
          stackId: 'my-stack',
        },
        expected: 'MyProject-Environment-Testing-MyStack',
      },
      {
        name: 'environmentType missing',
        input: {
          projectName: 'my-project',
          accountType: 'mock',
          stackId: 'my-stack',
        },
        expected: 'MyProject-Mock-Account-MyStack',
      },
      {
        name: 'environmentType empty',
        input: {
          projectName: 'my-project',
          accountType: 'mock',
          environmentType: '',
          stackId: 'my-stack',
        },
        expected: 'MyProject-Mock-Account-MyStack',
      },
      {
        name: 'accountType missing',
        input: {
          projectName: 'my-project',
          stackId: 'my-stack',
        },
        expected: 'MyProject-MyStack',
      },
      {
        name: 'accountType empty',
        input: {
          projectName: 'my-project',
          accountType: '',
          stackId: 'my-stack',
        },
        expected: 'MyProject-MyStack',
      },
      {
        name: 'too long stackId name',
        input: {
          projectName: 'my-project',
          accountType: 'mock',
          environmentType: 'testing',
          stackId: 'n'.repeat(49),
        },
        expected: 'MyProject-Environment-Testing-'+capitalizeFirstLetter('n'.repeat(48)),
      },
      {
        name: 'too long project name',
        input: {
          projectName: 'n'.repeat(33),
          accountType: 'mock',
          environmentType: 'testing',
          stackId: 'my-stack',
        },
        expected: capitalizeFirstLetter('n'.repeat(32))+'-Environment-Testing-MyStack',
      },
      {
        name: 'too long accountType name',
        input: {
          projectName: 'my-project',
          accountType: 'n'.repeat(33),
          environmentType: undefined,
          stackId: 'my-stack',
        },
        expected: 'MyProject-'+capitalizeFirstLetter('n'.repeat(32))+'-Account-MyStack',
      },
      {
        name: 'too long environmentType name',
        input: {
          projectName: 'my-project',
          accountType: undefined,
          environmentType: 'n'.repeat(33),
          stackId: 'my-stack',
        },
        expected: 'MyProject-Environment-'+capitalizeFirstLetter('n'.repeat(32))+'-MyStack',
      },
      {
        name: 'everything too long',
        input: {
          projectName: 'n'.repeat(33),
          accountType: undefined,
          environmentType: 'n'.repeat(33),
          stackId: 'n'.repeat(49),
        },
        expected: capitalizeFirstLetter('n'.repeat(32))+'-Environment-'+capitalizeFirstLetter('n'.repeat(32))+'-'+capitalizeFirstLetter('n'.repeat(48)),
      },
    ].map(runTest);
  });
});
