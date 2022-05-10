import { formatDescription } from './index';

interface testCase {
  readonly name: string;
  readonly input: {
    account?: string;
    environment?: string;
    body: string;
  };
  readonly expected: string;
}

function runTest(tc: testCase): void {
  test(tc.name, function(): void {
    const actual = formatDescription({
      body: tc.input.body,
      accountType: tc.input.account,
      environmentType: tc.input.environment,
    });
    const expected = tc.expected;
    expect(typeof actual).toBe('string');
    expect(actual.length).toBeLessThanOrEqual(1024);
    expect(actual).toBe(expected);
  });
}

function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

describe('SmartStack', () => {
  describe('description', () => {
    [
      {
        name: 'all values',
        input: {
          account: 'mock',
          environment: 'testing',
          body: 'This is my REALLY good summary',
        },
        expected: 'Testing Environment: This is my REALLY good summary',
      },
      {
        name: 'environment missing',
        input: {
          account: 'mock',
          body: 'This is my REALLY good summary',
        },
        expected: 'Mock Account: This is my REALLY good summary',
      },
      {
        name: 'environment empty',
        input: {
          account: 'mock',
          environment: '',
          body: 'This is my REALLY good summary',
        },
        expected: 'Mock Account: This is my REALLY good summary',
      },
      {
        name: 'account missing',
        input: {
          body: 'This is my REALLY good summary',
        },
        expected: 'This is my REALLY good summary',
      },
      {
        name: 'account empty',
        input: {
          account: '',
          body: 'This is my REALLY good summary',
        },
        expected: 'This is my REALLY good summary',
      },
      {
        name: 'too long summary',
        input: {
          account: 'mock',
          environment: 'testing',
          body: 'n'.repeat(281),
        },
        expected: 'Testing Environment: '+'n'.repeat(280)+'...',
      },
      {
        name: 'too long account name',
        input: {
          account: 'n'.repeat(33),
          environment: undefined,
          body: 'This is my REALLY good summary',
        },
        expected: ''+capitalizeFirstLetter('n'.repeat(32))+' Account: This is my REALLY good summary',
      },
      {
        name: 'too long environment name',
        input: {
          account: undefined,
          environment: 'n'.repeat(33),
          body: 'This is my REALLY good summary',
        },
        expected: ''+capitalizeFirstLetter('n'.repeat(32))+' Environment: This is my REALLY good summary',
      },
      {
        name: 'everything too long',
        input: {
          project: 'n'.repeat(33),
          account: undefined,
          environment: 'n'.repeat(33),
          body: 'n'.repeat(281),
        },
        expected: capitalizeFirstLetter('n'.repeat(32))+' Environment: '+'n'.repeat(280)+'...',
      },
    ].map(runTest);
  });
});