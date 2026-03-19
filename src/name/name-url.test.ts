import * as cdk from "aws-cdk-lib";
import { Annotations, Match, Template } from "aws-cdk-lib/assertions";
import { UrlName, urlName } from ".";
import { Project, ProjectProps } from "../project";
import { MAX_LENGTH_DEFAULT } from "./max-length";

const projectProps: ProjectProps = {
  name: "test-project",
  author: {
    organization: "Acme",
    name: "Test Author",
    email: "test@example.com",
  },
  accounts: {},
};

describe("UrlName resources", () => {
  test('Produce valid environmental output with "it"', () => {
    const project = new Project({
      ...projectProps,
      context: {
        environment: "test",
      },
    });

    const stack = new cdk.Stack(project, "testing-stack");

    const expected = "test-foo-bar";
    expect(UrlName.it(stack, "fooBar")).toBe(expected);
    expect(UrlName.it(stack, "foo-bar")).toBe(expected);
    expect(UrlName.it(stack, "foo bar")).toBe(expected);
    expect(UrlName.it(stack, "foo.bar")).toBe(expected);
  });

  test('Produce valid non-environmental output with "withProject"', () => {
    const project = new Project({
      ...projectProps,
    });

    const stack = new cdk.Stack(project, "testing-stack");

    const expected = "test-project-foo-bar";
    expect(UrlName.withProject(stack, "fooBar")).toBe(expected);
    expect(UrlName.withProject(stack, "foo-bar")).toBe(expected);
    expect(UrlName.withProject(stack, "foo bar")).toBe(expected);
    expect(UrlName.withProject(stack, "foo.bar")).toBe(expected);
  });

  test('Produce valid environmental output with "withProject"', () => {
    const project = new Project({
      ...projectProps,
      context: {
        environment: "test",
      },
    });

    const stack = new cdk.Stack(project, "testing-stack");

    const expected = "test-project-test-foo-bar";
    expect(UrlName.withProject(stack, "fooBar")).toBe(expected);
    expect(UrlName.withProject(stack, "foo-bar")).toBe(expected);
    expect(UrlName.withProject(stack, "foo bar")).toBe(expected);
    expect(UrlName.withProject(stack, "foo.bar")).toBe(expected);
  });

  test('Produce valid environmental output with "globally"', () => {
    const project = new Project({
      ...projectProps,
      context: {
        environment: "test",
      },
    });

    const stack = new cdk.Stack(project, "testing-stack");

    const expected = "acme-test-project-test-foo-bar";
    expect(UrlName.globally(stack, "fooBar")).toBe(expected);
    expect(UrlName.globally(stack, "foo-bar")).toBe(expected);
    expect(UrlName.globally(stack, "foo bar")).toBe(expected);
    expect(UrlName.globally(stack, "foo.bar")).toBe(expected);
  });

  const longBaseName = "a".repeat(MAX_LENGTH_DEFAULT + 10);
  const maxLength = MAX_LENGTH_DEFAULT + 100;

  test.each<[string, (stack: cdk.Stack, name: string) => string, string]>([
    ["it", (s, n) => UrlName.it(s, n, { maxLength }), `test-${longBaseName}`],
    [
      "withProject",
      (s, n) => UrlName.withProject(s, n, { maxLength }),
      `test-project-test-${longBaseName}`,
    ],
    [
      "globally",
      (s, n) => UrlName.globally(s, n, { maxLength }),
      `acme-test-project-test-${longBaseName}`,
    ],
  ])(
    '"%s" accepts baseName longer than MAX_LENGTH_DEFAULT chars when maxLength is higher',
    (_methodName, methodCall, expected) => {
      const project = new Project({
        ...projectProps,
        context: { environment: "test" },
      });

      const stack = new cdk.Stack(project, "testing-stack");

      expect(methodCall(stack, longBaseName)).toBe(expected);
      Template.fromStack(stack);
      Annotations.fromStack(stack).hasNoError("*", Match.anyValue());
    },
  );

  test("shorthand method", () => {
    const project = new Project({
      ...projectProps,
      context: {
        environment: "test",
      },
    });

    const stack = new cdk.Stack(project, "testing-stack");

    const input = "fooBar";
    const expected = "test-project-test-foo-bar";
    const explicit = UrlName.withProject(stack, input);
    expect(explicit).toBe(expected);
    expect(urlName(stack, input)).toBe(expected);
  });
});
