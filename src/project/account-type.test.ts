import * as cdk from "aws-cdk-lib";
import { AccountType } from "./account-type";
import { expectErrorMetadata } from "../__test__/expectErrorMetadata";
import { TestableProjectStack } from "../__test__/TestableProjectStack";
import { TestableResource } from "../__test__/TestableResource";
import { AccountStrategy } from "../configurations";

describe("set", () => {
  const accountType = "dev";
  const stack = new cdk.Stack();
  AccountType.set(stack, accountType);
  const testable = new TestableResource({ scope: stack });

  test("context: account-type", () => {
    expect(testable.node.getContext("account-type")).toBe(accountType);
  });

  test("context: account", () => {
    expect(testable.node.getContext("account")).toBe(accountType);
  });
});

describe("get", () => {
  test("returns empty string and sets error metadata if no account type defined", () => {
    const stack = new cdk.Stack();
    const testable = new TestableResource({ scope: stack });
    expect(AccountType.get(testable)).toBe("");
    expectErrorMetadata(
      testable,
      expect.stringContaining("Account Type not specified"),
    );
  });

  test("set via account-type context", () => {
    const stack = new cdk.Stack();
    stack.node.setContext("account-type", "dev");
    const testable = new TestableResource({ scope: stack });
    expect(AccountType.get(testable)).toBe("dev");
  });

  test("set via account context", () => {
    const stack = new cdk.Stack();
    stack.node.setContext("account", "dev");
    const testable = new TestableResource({ scope: stack });
    expect(AccountType.get(testable)).toBe("dev");
  });

  test("prefer account-type context over account context", () => {
    const stack = new cdk.Stack();
    stack.node.setContext("account-type", "dev");
    stack.node.setContext("account", "prod");
    const testable = new TestableResource({ scope: stack });
    expect(AccountType.get(testable)).toBe("dev");
  });
});

describe("matchFromEnvironment", () => {
  test("returns matching account type for environment", () => {
    const accounts = AccountStrategy.three({
      dev: { id: "111111111111" },
      preprod: { id: "222222222222" },
      prod: { id: "333333333333" },
    });

    const stack = new TestableProjectStack({
      accounts,
      accountType: "dev",
    });

    const testable = new TestableResource({ scope: stack });

    expect(
      AccountType.matchFromEnvironment(testable, accounts, "development"),
    ).toBe("dev");
    expectErrorMetadata(testable, undefined);
  });

  test("returns empty string and sets error metadata if no matching account found", () => {
    const accounts = AccountStrategy.three({
      dev: { id: "111111111111" },
      preprod: { id: "222222222222" },
      prod: { id: "333333333333" },
    });

    const stack = new TestableProjectStack({
      accounts,
      accountType: "dev",
    });

    const testable = new TestableResource({ scope: stack });

    expect(
      AccountType.matchFromEnvironment(testable, accounts, "preprod"),
    ).toBe("");
    expectErrorMetadata(
      testable,
      expect.stringContaining(
        "Could not find matching account type for given environment preprod",
      ),
    );
  });
});
