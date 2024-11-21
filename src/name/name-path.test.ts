import * as cdk from "aws-cdk-lib";
import { PathName, pathName } from "./";
import { Project, ProjectProps } from "../project";

const projectProps: ProjectProps = {
  name: "test-project",
  author: {
    organization: "Acme",
    name: "Test Author",
    email: "test@example.com",
  },
  accounts: {},
};

describe("PathName resources", () => {
  test('Produce valid environmental output with "it"', () => {
    const project = new Project({
      ...projectProps,
      context: {
        environment: "test",
      },
    });

    const stack = new cdk.Stack(project, "testing-stack");

    const expectedBase = "/test/";
    expect(PathName.it(stack, "fooBar")).toBe(expectedBase + "fooBar");
    expect(PathName.it(stack, "foo-bar")).toBe(expectedBase + "foo-bar");
    expect(PathName.it(stack, "foo bar")).toBe(expectedBase + "foobar");
    expect(PathName.it(stack, "foo.bar")).toBe(expectedBase + "foobar");
    expect(PathName.it(stack, "foo/bar")).toBe(expectedBase + "foo/bar");
  });

  test('Produce valid non-environmental output with "withProject"', () => {
    const project = new Project({
      ...projectProps,
    });

    const stack = new cdk.Stack(project, "testing-stack");

    const expectedBase = "/test/project/";
    expect(PathName.withProject(stack, "fooBar")).toBe(expectedBase + "fooBar");
    expect(PathName.withProject(stack, "foo-bar")).toBe(
      expectedBase + "foo-bar",
    );
    expect(PathName.withProject(stack, "foo bar")).toBe(
      expectedBase + "foobar",
    );
    expect(PathName.withProject(stack, "foo.bar")).toBe(
      expectedBase + "foobar",
    );
    expect(PathName.withProject(stack, "foo/bar")).toBe(
      expectedBase + "foo/bar",
    );
  });

  test('Produce valid environmental output with "withProject"', () => {
    const project = new Project({
      ...projectProps,
      context: {
        environment: "test",
      },
    });

    const stack = new cdk.Stack(project, "testing-stack");

    const expectedBase = "/test/project/test/";
    expect(PathName.withProject(stack, "fooBar")).toBe(expectedBase + "fooBar");
    expect(PathName.withProject(stack, "foo-bar")).toBe(
      expectedBase + "foo-bar",
    );
    expect(PathName.withProject(stack, "foo bar")).toBe(
      expectedBase + "foobar",
    );
    expect(PathName.withProject(stack, "foo.bar")).toBe(
      expectedBase + "foobar",
    );
    expect(PathName.withProject(stack, "foo/bar")).toBe(
      expectedBase + "foo/bar",
    );
  });

  test('Produce valid environmental output with "globally"', () => {
    const project = new Project({
      ...projectProps,
      context: {
        environment: "test",
      },
    });

    const stack = new cdk.Stack(project, "testing-stack");

    const expectedBase = "/acme/test/project/test/";
    expect(PathName.globally(stack, "fooBar")).toBe(expectedBase + "fooBar");
    expect(PathName.globally(stack, "foo-bar")).toBe(expectedBase + "foo-bar");
    expect(PathName.globally(stack, "foo bar")).toBe(expectedBase + "foobar");
    expect(PathName.globally(stack, "foo.bar")).toBe(expectedBase + "foobar");
    expect(PathName.globally(stack, "foo/bar")).toBe(expectedBase + "foo/bar");
  });

  test("shorthand method", () => {
    const project = new Project({
      ...projectProps,
      context: {
        environment: "test",
      },
    });

    const stack = new cdk.Stack(project, "testing-stack");

    const input = "fooBar";
    const expected = "/test/project/test/fooBar";
    const explicit = PathName.withProject(stack, input);
    expect(explicit).toBe(expected);
    expect(pathName(stack, input)).toBe(expected);
  });
});
