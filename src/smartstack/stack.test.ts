import { pascalCase } from "change-case";
import { expectErrorMetadata } from "../__test__/expectErrorMetadata";
import { TestableProjectStack } from "../__test__/TestableProjectStack";
import { AccountStrategy } from "../configurations";
import { SmartStack } from "./stack";
import { AccountType } from "../configurations/accounts";

test("TestableProjectStack is instance of SmartStack", () => {
  const stack = new TestableProjectStack({
    accounts: AccountStrategy.two({
      dev: { id: "111111111111" },
      prod: { id: "222222222222" },
    }),
    accountType: AccountType.DEV,
  });
  expect(stack).toBeInstanceOf(SmartStack);
});

describe("stackName", () => {
  test("for account-type stacks", () => {
    const stack = new TestableProjectStack({
      accounts: AccountStrategy.two({
        dev: { id: "111111111111" },
        prod: { id: "222222222222" },
      }),
      accountType: AccountType.DEV,
    });
    expect(stack.stackName).toEqual(
      `${pascalCase(stack.projectName)}-Account-${pascalCase(stack.stackConstructId)}`,
    );
  });
  test("for environment-type stacks", () => {
    const stack = new TestableProjectStack({
      accounts: AccountStrategy.two({
        dev: { id: "111111111111" },
        prod: { id: "222222222222" },
      }),
      accountType: AccountType.DEV,
      environmentType: "staging",
    });
    expect(stack.stackName).toEqual(
      `${pascalCase(stack.projectName)}-Environment-Staging-${pascalCase(stack.stackConstructId)}`,
    );
  });
});

describe("description", () => {
  test("adds error metadata if too short stack description", () => {
    const stack = new TestableProjectStack({
      accounts: AccountStrategy.two({
        dev: { id: "111111111111" },
        prod: { id: "222222222222" },
      }),
      accountType: AccountType.DEV,
      stackProps: {
        description: "a".repeat(11),
      },
    });
    expectErrorMetadata(
      stack,
      expect.stringContaining(
        "Description is required and should be at least 12 characters",
      ),
    );
  });

  test("adds error metadata if description is too long", () => {
    const stack = new TestableProjectStack({
      accounts: AccountStrategy.two({
        dev: { id: "111111111111" },
        prod: { id: "222222222222" },
      }),
      accountType: AccountType.DEV,
      stackProps: {
        description: "a".repeat(281),
      },
    });
    expectErrorMetadata(
      stack,
      expect.stringContaining("Description is should be at max 280 characters"),
    );
  });

  test("does not add error metadata if description length is valid", () => {
    const stack = new TestableProjectStack({
      accounts: AccountStrategy.two({
        dev: { id: "111111111111" },
        prod: { id: "222222222222" },
      }),
      accountType: AccountType.DEV,
      stackProps: {
        description: "a".repeat(12),
      },
    });
    expectErrorMetadata(stack, undefined);
  });
});

describe("terminationProtection", () => {
  test.each([
    ["staging", true],
    ["production", true],
    ["development", false],
    ["feature/foo-bar", false],
    ["test", false],
    ["preproduction", false],
  ])("is %s for %s environment", (envType, expected) => {
    const stack = new TestableProjectStack({
      accounts: AccountStrategy.one({
        shared: { id: "111111111111" },
      }),
      accountType: AccountType.SHARED,
      environmentType: envType,
    });
    expect(stack.terminationProtection).toBe(expected);
  });
});

describe("env", () => {
  test("uses accountId and region from project context if not overridden", () => {
    const stack = new TestableProjectStack({
      defaultRegion: "eu-north-1",
      accounts: AccountStrategy.one({
        shared: { id: "111111111111" },
      }),
      accountType: AccountType.SHARED,
    });
    expect(stack.account).toEqual("111111111111");
    expect(stack.region).toEqual("eu-north-1");
  });
  test("override accountId", () => {
    const stack = new TestableProjectStack({
      accounts: AccountStrategy.one({
        shared: { id: "111111111111" },
      }),
      accountType: AccountType.SHARED,
      defaultRegion: "eu-north-1",
      stackProps: {
        env: {
          account: "222222222222",
        },
      },
    });
    expect(stack.account).toEqual("222222222222");
    expect(stack.region).toEqual("eu-north-1");
  });

  test("override region", () => {
    const stack = new TestableProjectStack({
      accounts: AccountStrategy.one({
        shared: { id: "111111111111" },
      }),
      accountType: AccountType.SHARED,
      defaultRegion: "eu-north-1",
      stackProps: {
        env: {
          region: "eu-central-1",
        },
      },
    });
    expect(stack.account).toEqual("111111111111");
    expect(stack.region).toEqual("eu-central-1");
  });
});
