import { decideTerminationProtection, TerminationProtectionProps } from '.';

interface TestCase {
  name: string;
  input: TerminationProtectionProps;
  expected: boolean;
}

function runTest(tc: TestCase) {
  test(tc.name, () => {
    const actual = decideTerminationProtection(tc.input);
    expect(actual).toBe(tc.expected);
  });
}

describe('SmartStack', () => {

  describe('terminationProtection', () => {
    [
      {
        name: 'override set to false for non-environmental',
        input: {
          override: false,
        },
        expected: false,
      },
      {
        name: 'override set to true for non-environmental',
        input: {
          override: true,
        },
        expected: true,
      },
      {
        name: 'override set to false for staging',
        input: {
          override: false,
          environmentType: 'staging',
        },
        expected: false,
      },
      {
        name: 'override set to true for mock1',
        input: {
          override: true,
          environmentType: 'mock1',
        },
        expected: true,
      },
      {
        name: 'non-environmental',
        input: {},
        expected: true,
      },
      {
        name: 'feature environment',
        input: {
          environmentType: 'feature/foobar',
        },
        expected: false,
      },
      {
        name: 'test environment',
        input: {
          environmentType: 'test',
        },
        expected: false,
      },
      {
        name: 'staging environment',
        input: {
          environmentType: 'staging',
        },
        expected: true,
      },
      {
        name: 'preproduction environment',
        input: {
          environmentType: 'preproduction',
        },
        expected: false,
      },
      {
        name: 'production environment',
        input: {
          environmentType: 'production',
        },
        expected: true,
      },
    ].map(runTest);
  });
});