import { EnvironmentContext } from "./environment";
import { expectErrorMetadata } from "../__test__/expectErrorMetadata";
import { TestableProjectStack } from "../__test__/TestableProjectStack";
import { AccountStrategy, AccountType } from "../configurations/accounts";

describe("getName", () => {
  test("returns environment name", () => {
    const stack = new TestableProjectStack({
      accounts: AccountStrategy.three({
        dev: { id: "111111111111" },
        preprod: { id: "222222222222" },
        prod: { id: "333333333333" },
      }),
      accountType: AccountType.DEV,
      environmentType: "development",
    });

    const result = EnvironmentContext.getName(stack);
    expect(result).toBe("development");
    expectErrorMetadata(stack, undefined);
  });
  test("error metadata attached to scope if in non-environmental context", () => {
    const stack = new TestableProjectStack({
      accounts: AccountStrategy.two({
        dev: { id: "111111111111" },
        prod: { id: "222222222222" },
      }),
      accountType: AccountType.DEV,
    });

    const result = EnvironmentContext.getName(stack);

    expect(result).toBe("");
    expectErrorMetadata(
      stack,
      expect.stringContaining("Environment Type not specified"),
    );
  });
});

describe("getUrlName", () => {
  test("returns param-cased environment name", () => {
    const stack = new TestableProjectStack({
      accounts: AccountStrategy.three({
        dev: { id: "111111111111" },
        preprod: { id: "222222222222" },
        prod: { id: "333333333333" },
      }),
      accountType: AccountType.DEV,
      environmentType: "feature/ABC-123/new-stuff",
    });

    const result = EnvironmentContext.getUrlName(stack);
    expect(result).toBe("feature-abc-123-new-stuff");
    expectErrorMetadata(stack, undefined);
  });

  test("error metadata attached to scope if in non-environmental context", () => {
    const stack = new TestableProjectStack({
      accounts: AccountStrategy.two({
        dev: { id: "111111111111" },
        prod: { id: "222222222222" },
      }),
      accountType: AccountType.DEV,
    });

    const result = EnvironmentContext.getUrlName(stack);

    expect(result).toBe("");
    expectErrorMetadata(
      stack,
      expect.stringContaining("Environment Type not specified"),
    );
  });
});

describe("getLabel", () => {
  test("returns environment label for feature environment", () => {
    const stack = new TestableProjectStack({
      accounts: AccountStrategy.three({
        dev: { id: "111111111111" },
        preprod: { id: "222222222222" },
        prod: { id: "333333333333" },
      }),
      accountType: AccountType.DEV,
      environmentType: "feature/ABC-123/new-stuff",
    });

    const result = EnvironmentContext.getLabel(stack);
    expect(result).toBe("feature/[/a-zA-z0-9-]+");
    expectErrorMetadata(stack, undefined);
  });

  test("error metadata attached to scope if in non-environmental context", () => {
    const stack = new TestableProjectStack({
      accounts: AccountStrategy.two({
        dev: { id: "111111111111" },
        prod: { id: "222222222222" },
      }),
      accountType: AccountType.DEV,
    });

    const result = EnvironmentContext.getLabel(stack);

    expect(result).toBe("");
    expectErrorMetadata(
      stack,
      expect.stringContaining("Environment Type not specified"),
    );
  });
});

describe("getCategory", () => {
  test("returns environment category for feature environment", () => {
    const stack = new TestableProjectStack({
      accounts: AccountStrategy.three({
        dev: { id: "111111111111" },
        preprod: { id: "222222222222" },
        prod: { id: "333333333333" },
      }),
      accountType: AccountType.DEV,
      environmentType: "feature/ABC-123/new-stuff",
    });

    const result = EnvironmentContext.getCategory(stack);
    expect(result).toBe("feature");
    expectErrorMetadata(stack, undefined);
  });

  test("error metadata attached to scope if in non-environmental context", () => {
    const stack = new TestableProjectStack({
      accounts: AccountStrategy.two({
        dev: { id: "111111111111" },
        prod: { id: "222222222222" },
      }),
      accountType: AccountType.DEV,
    });

    const result = EnvironmentContext.getCategory(stack);

    expect(result).toBe(undefined);
    expectErrorMetadata(
      stack,
      expect.stringContaining("Environment Type not specified"),
    );
  });
});

describe("isMock", () => {
  test("returns true for mock environment", () => {
    const stack = new TestableProjectStack({
      accounts: AccountStrategy.three({
        dev: { id: "111111111111" },
        preprod: { id: "222222222222" },
        prod: { id: "333333333333" },
      }),
      accountType: AccountType.MOCK,
      environmentType: "mock1",
    });

    const result = EnvironmentContext.isMock(stack);
    expect(result).toBe(true);
    expectErrorMetadata(stack, undefined);
  });

  test("returns false for non-mock environment", () => {
    const stack = new TestableProjectStack({
      accounts: AccountStrategy.three({
        dev: { id: "111111111111" },
        preprod: { id: "222222222222" },
        prod: { id: "333333333333" },
      }),
      accountType: AccountType.DEV,
      environmentType: "development",
    });

    const result = EnvironmentContext.isMock(stack);
    expect(result).toBe(false);
    expectErrorMetadata(stack, undefined);
  });

  test("error metadata attached to scope if in non-environmental context", () => {
    const stack = new TestableProjectStack({
      accounts: AccountStrategy.two({
        dev: { id: "111111111111" },
        prod: { id: "222222222222" },
      }),
      accountType: AccountType.DEV,
    });

    const result = EnvironmentContext.isMock(stack);

    expect(result).toBe(false);
    expectErrorMetadata(
      stack,
      expect.stringContaining("Environment Type not specified"),
    );
  });
});

describe("isDevelopment", () => {
  test("returns true for development environment", () => {
    const stack = new TestableProjectStack({
      accounts: AccountStrategy.three({
        dev: { id: "111111111111" },
        preprod: { id: "222222222222" },
        prod: { id: "333333333333" },
      }),
      accountType: AccountType.DEV,
      environmentType: "development",
    });

    const result = EnvironmentContext.isDevelopment(stack);
    expect(result).toBe(true);
    expectErrorMetadata(stack, undefined);
  });

  test("returns false for non-development environment", () => {
    const stack = new TestableProjectStack({
      accounts: AccountStrategy.three({
        dev: { id: "111111111111" },
        preprod: { id: "222222222222" },
        prod: { id: "333333333333" },
      }),
      accountType: AccountType.MOCK,
      environmentType: "mock1",
    });

    const result = EnvironmentContext.isDevelopment(stack);
    expect(result).toBe(false);
    expectErrorMetadata(stack, undefined);
  });

  test("error metadata attached to scope if in non-environmental context", () => {
    const stack = new TestableProjectStack({
      accounts: AccountStrategy.two({
        dev: { id: "111111111111" },
        prod: { id: "222222222222" },
      }),
      accountType: AccountType.DEV,
    });

    const result = EnvironmentContext.isDevelopment(stack);

    expect(result).toBe(false);
    expectErrorMetadata(
      stack,
      expect.stringContaining("Environment Type not specified"),
    );
  });
});

describe("isFeature", () => {
  test("returns true for feature environment", () => {
    const stack = new TestableProjectStack({
      accounts: AccountStrategy.three({
        dev: { id: "111111111111" },
        preprod: { id: "222222222222" },
        prod: { id: "333333333333" },
      }),
      accountType: AccountType.DEV,
      environmentType: "feature/test-feature",
    });

    const result = EnvironmentContext.isFeature(stack);
    expect(result).toBe(true);
    expectErrorMetadata(stack, undefined);
  });

  test("returns false for non-feature environment", () => {
    const stack = new TestableProjectStack({
      accounts: AccountStrategy.three({
        dev: { id: "111111111111" },
        preprod: { id: "222222222222" },
        prod: { id: "333333333333" },
      }),
      accountType: AccountType.DEV,
      environmentType: "development",
    });

    const result = EnvironmentContext.isFeature(stack);
    expect(result).toBe(false);
    expectErrorMetadata(stack, undefined);
  });

  test("error metadata attached to scope if in non-environmental context", () => {
    const stack = new TestableProjectStack({
      accounts: AccountStrategy.two({
        dev: { id: "111111111111" },
        prod: { id: "222222222222" },
      }),
      accountType: AccountType.DEV,
    });

    const result = EnvironmentContext.isFeature(stack);

    expect(result).toBe(false);
    expectErrorMetadata(
      stack,
      expect.stringContaining("Environment Type not specified"),
    );
  });
});

describe("isVerification", () => {
  test("returns true for test environment", () => {
    const stack = new TestableProjectStack({
      accounts: AccountStrategy.three({
        dev: { id: "111111111111" },
        preprod: { id: "222222222222" },
        prod: { id: "333333333333" },
      }),
      accountType: AccountType.DEV,
      environmentType: "test",
    });

    const result = EnvironmentContext.isVerification(stack);
    expect(result).toBe(true);
    expectErrorMetadata(stack, undefined);
  });

  test("returns true for preproduction environment", () => {
    const stack = new TestableProjectStack({
      accounts: AccountStrategy.three({
        dev: { id: "111111111111" },
        preprod: { id: "222222222222" },
        prod: { id: "333333333333" },
      }),
      accountType: AccountType.PREPROD,
      environmentType: "preproduction",
    });

    const result = EnvironmentContext.isVerification(stack);
    expect(result).toBe(true);
    expectErrorMetadata(stack, undefined);
  });

  test("returns false for non-verification environment", () => {
    const stack = new TestableProjectStack({
      accounts: AccountStrategy.three({
        dev: { id: "111111111111" },
        preprod: { id: "222222222222" },
        prod: { id: "333333333333" },
      }),
      accountType: AccountType.DEV,
      environmentType: "development",
    });

    const result = EnvironmentContext.isVerification(stack);
    expect(result).toBe(false);
    expectErrorMetadata(stack, undefined);
  });

  test("error metadata attached to scope if in non-environmental context", () => {
    const stack = new TestableProjectStack({
      accounts: AccountStrategy.two({
        dev: { id: "111111111111" },
        prod: { id: "222222222222" },
      }),
      accountType: AccountType.DEV,
    });

    const result = EnvironmentContext.isVerification(stack);

    expect(result).toBe(false);
    expectErrorMetadata(
      stack,
      expect.stringContaining("Environment Type not specified"),
    );
  });
});

describe("isStable", () => {
  test("returns true for staging environment", () => {
    const stack = new TestableProjectStack({
      accounts: AccountStrategy.three({
        dev: { id: "111111111111" },
        preprod: { id: "222222222222" },
        prod: { id: "333333333333" },
      }),
      accountType: AccountType.DEV,
      environmentType: "staging",
    });

    const result = EnvironmentContext.isStable(stack);
    expect(result).toBe(true);
    expectErrorMetadata(stack, undefined);
  });

  test("returns true for production environment", () => {
    const stack = new TestableProjectStack({
      accounts: AccountStrategy.three({
        dev: { id: "111111111111" },
        preprod: { id: "222222222222" },
        prod: { id: "333333333333" },
      }),
      accountType: AccountType.PROD,
      environmentType: "production",
    });

    const result = EnvironmentContext.isStable(stack);
    expect(result).toBe(true);
    expectErrorMetadata(stack, undefined);
  });

  test("returns false for non-stable environment", () => {
    const stack = new TestableProjectStack({
      accounts: AccountStrategy.three({
        dev: { id: "111111111111" },
        preprod: { id: "222222222222" },
        prod: { id: "333333333333" },
      }),
      accountType: AccountType.DEV,
      environmentType: "development",
    });

    const result = EnvironmentContext.isStable(stack);
    expect(result).toBe(false);
    expectErrorMetadata(stack, undefined);
  });

  test("error metadata attached to scope if in non-environmental context", () => {
    const stack = new TestableProjectStack({
      accounts: AccountStrategy.two({
        dev: { id: "111111111111" },
        prod: { id: "222222222222" },
      }),
      accountType: AccountType.DEV,
    });

    const result = EnvironmentContext.isStable(stack);

    expect(result).toBe(false);
    expectErrorMetadata(
      stack,
      expect.stringContaining("Environment Type not specified"),
    );
  });
});

describe("getFeatureInfo", () => {
  test("returns feature name for feature environment", () => {
    const stack = new TestableProjectStack({
      accounts: AccountStrategy.three({
        dev: { id: "111111111111" },
        preprod: { id: "222222222222" },
        prod: { id: "333333333333" },
      }),
      accountType: AccountType.DEV,
      environmentType: "feature/new-feature",
    });

    const result = EnvironmentContext.getFeatureInfo(stack);
    expect(result).toBe("new-feature");
    expectErrorMetadata(stack, undefined);
  });

  test("returns complex feature path", () => {
    const stack = new TestableProjectStack({
      accounts: AccountStrategy.three({
        dev: { id: "111111111111" },
        preprod: { id: "222222222222" },
        prod: { id: "333333333333" },
      }),
      accountType: AccountType.DEV,
      environmentType: "feature/ABC-123/new-stuff",
    });

    const result = EnvironmentContext.getFeatureInfo(stack);
    expect(result).toBe("ABC-123/new-stuff");
    expectErrorMetadata(stack, undefined);
  });

  test("returns empty string for non-feature environment", () => {
    const stack = new TestableProjectStack({
      accounts: AccountStrategy.three({
        dev: { id: "111111111111" },
        preprod: { id: "222222222222" },
        prod: { id: "333333333333" },
      }),
      accountType: AccountType.DEV,
      environmentType: "development",
    });

    const result = EnvironmentContext.getFeatureInfo(stack);
    expect(result).toBe("");
    expectErrorMetadata(stack, undefined);
  });

  test("error metadata attached to scope if in non-environmental context", () => {
    const stack = new TestableProjectStack({
      accounts: AccountStrategy.two({
        dev: { id: "111111111111" },
        prod: { id: "222222222222" },
      }),
      accountType: AccountType.DEV,
    });

    const result = EnvironmentContext.getFeatureInfo(stack);
    expect(result).toBe("");
    expectErrorMetadata(
      stack,
      expect.stringContaining("Environment Type not specified"),
    );
  });
});
