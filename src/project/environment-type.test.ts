import { EnvironmentType } from "./environment-type";
import { expectErrorMetadata } from "../__test__/expectErrorMetadata";
import { TestableProjectStack } from "../__test__/TestableProjectStack";

import { AccountStrategy, AccountType } from "../configurations/accounts";

describe("set", () => {
  test("sets all environment context values", () => {
    const stack = new TestableProjectStack({
      accounts: AccountStrategy.two({
        dev: { id: "111111111111" },
        prod: { id: "222222222222" },
      }),
      accountType: AccountType.DEV,
    });

    EnvironmentType.set(stack, "development");

    expect(stack.node.tryGetContext("environment-type")).toBe("development");
    expect(stack.node.tryGetContext("environment")).toBe("development");
    expect(stack.node.tryGetContext("env")).toBe("development");
  });
});

describe("tryGet", () => {
  test("prefers environment-type over environment and env", () => {
    const stack = new TestableProjectStack({
      accounts: AccountStrategy.two({
        dev: { id: "111111111111" },
        prod: { id: "222222222222" },
      }),
      accountType: AccountType.DEV,
    });
    stack.node.setContext("environment-type", "development");
    stack.node.setContext("environment", "staging");
    stack.node.setContext("env", "production");

    expect(EnvironmentType.tryGet(stack)).toBe("development");
  });

  test("prefers environment over env when environment-type not set", () => {
    const stack = new TestableProjectStack({
      accounts: AccountStrategy.two({
        dev: { id: "111111111111" },
        prod: { id: "222222222222" },
      }),
      accountType: AccountType.DEV,
    });
    stack.node.setContext("environment", "staging");
    stack.node.setContext("env", "production");

    expect(EnvironmentType.tryGet(stack)).toBe("staging");
  });

  test("uses env when environment-type and environment not set", () => {
    const stack = new TestableProjectStack({
      accounts: AccountStrategy.two({
        dev: { id: "111111111111" },
        prod: { id: "222222222222" },
      }),
      accountType: AccountType.DEV,
    });
    stack.node.setContext("env", "production");

    expect(EnvironmentType.tryGet(stack)).toBe("production");
  });

  test("returns undefined if no environment context set", () => {
    const stack = new TestableProjectStack({
      accounts: AccountStrategy.two({
        dev: { id: "111111111111" },
        prod: { id: "222222222222" },
      }),
      accountType: AccountType.DEV,
    });

    expect(EnvironmentType.tryGet(stack)).toBeUndefined();
  });
});

describe("get", () => {
  test("returns environment type if valid", () => {
    const stack = new TestableProjectStack({
      accounts: AccountStrategy.two({
        dev: { id: "111111111111" },
        prod: { id: "222222222222" },
      }),
      accountType: AccountType.DEV,
      environmentType: "development",
    });

    const result = EnvironmentType.get(stack, ["development", "production"]);
    expect(result).toBe("development");
    expectErrorMetadata(stack, undefined);
  });

  test("respects preference order when multiple contexts set", () => {
    const stack = new TestableProjectStack({
      accounts: AccountStrategy.two({
        dev: { id: "111111111111" },
        prod: { id: "222222222222" },
      }),
      accountType: AccountType.DEV,
    });
    stack.node.setContext("environment-type", "development");
    stack.node.setContext("environment", "staging");
    stack.node.setContext("env", "production");

    const result = EnvironmentType.get(stack, [
      "development",
      "staging",
      "production",
    ]);
    expect(result).toBe("development");
    expectErrorMetadata(stack, undefined);
  });

  test("returns empty string and sets error if environment type not specified", () => {
    const stack = new TestableProjectStack({
      accounts: AccountStrategy.two({
        dev: { id: "111111111111" },
        prod: { id: "222222222222" },
      }),
      accountType: AccountType.DEV,
    });

    const result = EnvironmentType.get(stack, ["development", "production"]);
    expect(result).toBe("");
    expectErrorMetadata(
      stack,
      expect.stringContaining("Environment Type not specified"),
    );
  });

  test("returns empty string and sets error if environment type not allowed", () => {
    const stack = new TestableProjectStack({
      accounts: AccountStrategy.two({
        dev: { id: "111111111111" },
        prod: { id: "222222222222" },
      }),
      accountType: AccountType.DEV,
    });
    stack.node.setContext("environment-type", "test");

    const result = EnvironmentType.get(stack, ["development", "production"]);
    expect(result).toBe("");
    expectErrorMetadata(
      stack,
      expect.stringContaining("Environment Type test not allowed"),
    );
  });

  test("matches environment type using regex pattern", () => {
    const stack = new TestableProjectStack({
      accounts: AccountStrategy.two({
        dev: { id: "111111111111" },
        prod: { id: "222222222222" },
      }),
      accountType: AccountType.DEV,
    });
    stack.node.setContext("environment-type", "feature/ABC-123");

    const result = EnvironmentType.get(stack, ["feature/.*", "production"]);
    expect(result).toBe("feature/ABC-123");
    expectErrorMetadata(stack, undefined);
  });
});
