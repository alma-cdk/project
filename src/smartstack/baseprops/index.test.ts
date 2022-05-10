import { StackProps } from 'aws-cdk-lib';
import { getBaseProps, BaseProps } from '.';


interface TestCase {
  name: string;
  input: StackProps;
  expected: BaseProps;
}

function runTest(tc: TestCase) {
  test(tc.name, () => {
    const actual = getBaseProps(tc.input);
    expect(actual).toEqual(tc.expected);
  });
}

describe('SmartStack', () => {
  describe('baseprops', () => {
    [
      {
        name: 'empty',
        input: {},
        expected: {},
      },
      {
        name: 'without description',
        input: {
          env: { region: 'eu-west-1' },
        },
        expected: {
          env: { region: 'eu-west-1' },
        },
      },
      {
        name: 'with description',
        input: {
          description: 'should be removed',
          env: { region: 'eu-west-1' },
        },
        expected: {
          env: { region: 'eu-west-1' },
        },
      },
    ].map(runTest);
  });
});