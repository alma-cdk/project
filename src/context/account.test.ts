import { AccountContext } from "./account";
import { TestableProjectStack } from "../__test__/TestableProjectStack";
import { AccountStrategy } from "../configurations/accounts";
import { AccountType } from "../configurations/accounts";

describe("getAccountId", () => {
  describe("one account", () => {
    test("mock", () => {
      const stack = new TestableProjectStack({
        accounts: AccountStrategy.one({
          mock: {
            id: "123456789012",
          },
          shared: {
            id: "111111111111",
          },
        }),
        accountType: AccountType.MOCK,
      });

      const result = AccountContext.getAccountId(stack);
      expect(result).toBe("123456789012");
    });

    test("shared", () => {
      const stack = new TestableProjectStack({
        accounts: AccountStrategy.one({
          shared: {
            id: "111111111111",
          },
        }),
        accountType: AccountType.SHARED,
      });

      const result = AccountContext.getAccountId(stack);
      expect(result).toBe("111111111111");
    });
  });

  describe("two accounts", () => {
    test("mock", () => {
      const stack = new TestableProjectStack({
        accounts: AccountStrategy.two({
          mock: {
            id: "123456789012",
          },
          dev: { id: "111111111111" },
          prod: { id: "222222222222" },
        }),
        accountType: AccountType.MOCK,
      });

      const result = AccountContext.getAccountId(stack);
      expect(result).toBe("123456789012");
    });

    test("dev", () => {
      const stack = new TestableProjectStack({
        accounts: AccountStrategy.two({
          dev: { id: "111111111111" },
          prod: { id: "222222222222" },
        }),
        accountType: AccountType.DEV,
      });

      const result = AccountContext.getAccountId(stack);
      expect(result).toBe("111111111111");
    });

    test("prod", () => {
      const stack = new TestableProjectStack({
        accounts: AccountStrategy.two({
          dev: { id: "111111111111" },
          prod: { id: "222222222222" },
        }),
        accountType: AccountType.PROD,
      });

      const result = AccountContext.getAccountId(stack);
      expect(result).toBe("222222222222");
    });
  });

  describe("three accounts", () => {
    test("mock", () => {
      const stack = new TestableProjectStack({
        accounts: AccountStrategy.three({
          mock: {
            id: "123456789012",
          },
          dev: { id: "111111111111" },
          preprod: { id: "222222222222" },
          prod: { id: "333333333333" },
        }),
        accountType: AccountType.MOCK,
      });

      const result = AccountContext.getAccountId(stack);
      expect(result).toBe("123456789012");
    });

    test("dev", () => {
      const stack = new TestableProjectStack({
        accounts: AccountStrategy.three({
          dev: { id: "111111111111" },
          preprod: { id: "222222222222" },
          prod: { id: "333333333333" },
        }),
        accountType: AccountType.DEV,
      });

      const result = AccountContext.getAccountId(stack);
      expect(result).toBe("111111111111");
    });

    test("preprod", () => {
      const stack = new TestableProjectStack({
        accounts: AccountStrategy.three({
          dev: { id: "111111111111" },
          preprod: { id: "222222222222" },
          prod: { id: "333333333333" },
        }),
        accountType: AccountType.PREPROD,
      });

      const result = AccountContext.getAccountId(stack);
      expect(result).toBe("222222222222");
    });

    test("prod", () => {
      const stack = new TestableProjectStack({
        accounts: AccountStrategy.three({
          dev: { id: "111111111111" },
          preprod: { id: "222222222222" },
          prod: { id: "333333333333" },
        }),
        accountType: AccountType.PROD,
      });
      const result = AccountContext.getAccountId(stack);
      expect(result).toBe("333333333333");
    });
  });
});

describe("getAccountConfig", () => {
  describe("one account", () => {
    test("mock", () => {
      const stack = new TestableProjectStack({
        accounts: AccountStrategy.one({
          mock: {
            id: "123456789012",
            config: {
              testKey: "mockValue",
            },
          },
          shared: {
            id: "111111111111",
            config: {
              testKey: "testValue",
            },
          },
        }),
        accountType: AccountType.MOCK,
      });

      const result = AccountContext.getAccountConfig(stack, "testKey");
      expect(result).toBe("mockValue");
    });

    test("shared", () => {
      const stack = new TestableProjectStack({
        accounts: AccountStrategy.one({
          shared: {
            id: "111111111111",
            config: {
              testKey: "testValue",
            },
          },
        }),
        accountType: AccountType.SHARED,
      });

      const result = AccountContext.getAccountConfig(stack, "testKey");
      expect(result).toBe("testValue");
    });
  });

  describe("two accounts", () => {
    test("mock", () => {
      const stack = new TestableProjectStack({
        accounts: AccountStrategy.two({
          mock: {
            id: "123456789012",
            config: {
              testKey: "mockValue",
            },
          },
          dev: {
            id: "111111111111",
            config: {
              testKey: "devValue",
            },
          },
          prod: {
            id: "222222222222",
            config: {
              testKey: "prodValue",
            },
          },
        }),
        accountType: AccountType.MOCK,
      });

      const result = AccountContext.getAccountConfig(stack, "testKey");
      expect(result).toBe("mockValue");
    });

    test("dev", () => {
      const stack = new TestableProjectStack({
        accounts: AccountStrategy.two({
          dev: {
            id: "111111111111",
            config: {
              testKey: "devValue",
            },
          },
          prod: {
            id: "222222222222",
            config: {
              testKey: "prodValue",
            },
          },
        }),
        accountType: AccountType.DEV,
      });

      const result = AccountContext.getAccountConfig(stack, "testKey");
      expect(result).toBe("devValue");
    });

    test("prod", () => {
      const stack = new TestableProjectStack({
        accounts: AccountStrategy.two({
          dev: {
            id: "111111111111",
            config: {
              testKey: "devValue",
            },
          },
          prod: {
            id: "222222222222",
            config: {
              testKey: "prodValue",
            },
          },
        }),
        accountType: AccountType.PROD,
      });

      const result = AccountContext.getAccountConfig(stack, "testKey");
      expect(result).toBe("prodValue");
    });
  });

  describe("three accounts", () => {
    test("mock", () => {
      const stack = new TestableProjectStack({
        accounts: AccountStrategy.three({
          mock: {
            id: "123456789012",
            config: {
              testKey: "mockValue",
            },
          },
          dev: {
            id: "111111111111",
            config: {
              testKey: "devValue",
            },
          },
          preprod: {
            id: "222222222222",
            config: {
              testKey: "preprodValue",
            },
          },
          prod: {
            id: "333333333333",
            config: {
              testKey: "prodValue",
            },
          },
        }),
        accountType: AccountType.MOCK,
      });

      const result = AccountContext.getAccountConfig(stack, "testKey");
      expect(result).toBe("mockValue");
    });

    test("dev", () => {
      const stack = new TestableProjectStack({
        accounts: AccountStrategy.three({
          dev: {
            id: "111111111111",
            config: {
              testKey: "devValue",
            },
          },
          preprod: {
            id: "222222222222",
            config: {
              testKey: "preprodValue",
            },
          },
          prod: {
            id: "333333333333",
            config: {
              testKey: "prodValue",
            },
          },
        }),
        accountType: AccountType.DEV,
      });

      const result = AccountContext.getAccountConfig(stack, "testKey");
      expect(result).toBe("devValue");
    });

    test("preprod", () => {
      const stack = new TestableProjectStack({
        accounts: AccountStrategy.three({
          dev: {
            id: "111111111111",
            config: {
              testKey: "devValue",
            },
          },
          preprod: {
            id: "222222222222",
            config: {
              testKey: "preprodValue",
            },
          },
          prod: {
            id: "333333333333",
            config: {
              testKey: "prodValue",
            },
          },
        }),
        accountType: AccountType.PREPROD,
      });

      const result = AccountContext.getAccountConfig(stack, "testKey");
      expect(result).toBe("preprodValue");
    });

    test("prod", () => {
      const stack = new TestableProjectStack({
        accounts: AccountStrategy.three({
          dev: {
            id: "111111111111",
            config: {
              testKey: "devValue",
            },
          },
          preprod: {
            id: "222222222222",
            config: {
              testKey: "preprodValue",
            },
          },
          prod: {
            id: "333333333333",
            config: {
              testKey: "prodValue",
            },
          },
        }),
        accountType: AccountType.PROD,
      });

      const result = AccountContext.getAccountConfig(stack, "testKey");
      expect(result).toBe("prodValue");
    });
  });
});

describe("getAccountType", () => {
  describe("one account", () => {
    test("mock", () => {
      const stack = new TestableProjectStack({
        accounts: AccountStrategy.one({
          mock: {
            id: "123456789012",
          },
          shared: {
            id: "111111111111",
          },
        }),
        accountType: AccountType.MOCK,
      });

      const result = AccountContext.getAccountType(stack);
      expect(result).toBe(AccountType.MOCK);
    });

    test("shared", () => {
      const stack = new TestableProjectStack({
        accounts: AccountStrategy.one({
          shared: {
            id: "111111111111",
          },
        }),
        accountType: AccountType.SHARED,
      });

      const result = AccountContext.getAccountType(stack);
      expect(result).toBe(AccountType.SHARED);
    });
  });

  describe("two accounts", () => {
    test("mock", () => {
      const stack = new TestableProjectStack({
        accounts: AccountStrategy.two({
          mock: {
            id: "123456789012",
          },
          dev: { id: "111111111111" },
          prod: { id: "222222222222" },
        }),
        accountType: AccountType.MOCK,
      });

      const result = AccountContext.getAccountType(stack);
      expect(result).toBe(AccountType.MOCK);
    });

    test("dev", () => {
      const stack = new TestableProjectStack({
        accounts: AccountStrategy.two({
          dev: { id: "111111111111" },
          prod: { id: "222222222222" },
        }),
        accountType: AccountType.DEV,
      });

      const result = AccountContext.getAccountType(stack);
      expect(result).toBe(AccountType.DEV);
    });

    test("prod", () => {
      const stack = new TestableProjectStack({
        accounts: AccountStrategy.two({
          dev: { id: "111111111111" },
          prod: { id: "222222222222" },
        }),
        accountType: AccountType.PROD,
      });

      const result = AccountContext.getAccountType(stack);
      expect(result).toBe(AccountType.PROD);
    });
  });

  describe("three accounts", () => {
    test("mock", () => {
      const stack = new TestableProjectStack({
        accounts: AccountStrategy.three({
          mock: {
            id: "123456789012",
          },
          dev: { id: "111111111111" },
          preprod: { id: "222222222222" },
          prod: { id: "333333333333" },
        }),
        accountType: AccountType.MOCK,
      });

      const result = AccountContext.getAccountType(stack);
      expect(result).toBe(AccountType.MOCK);
    });

    test("dev", () => {
      const stack = new TestableProjectStack({
        accounts: AccountStrategy.three({
          dev: { id: "111111111111" },
          preprod: { id: "222222222222" },
          prod: { id: "333333333333" },
        }),
        accountType: AccountType.DEV,
      });

      const result = AccountContext.getAccountType(stack);
      expect(result).toBe(AccountType.DEV);
    });

    test("preprod", () => {
      const stack = new TestableProjectStack({
        accounts: AccountStrategy.three({
          dev: { id: "111111111111" },
          preprod: { id: "222222222222" },
          prod: { id: "333333333333" },
        }),
        accountType: AccountType.PREPROD,
      });

      const result = AccountContext.getAccountType(stack);
      expect(result).toBe(AccountType.PREPROD);
    });

    test("prod", () => {
      const stack = new TestableProjectStack({
        accounts: AccountStrategy.three({
          dev: { id: "111111111111" },
          preprod: { id: "222222222222" },
          prod: { id: "333333333333" },
        }),
        accountType: AccountType.PROD,
      });

      const result = AccountContext.getAccountType(stack);
      expect(result).toBe(AccountType.PROD);
    });
  });
});

describe("isMock", () => {
  test("returns true for mock account", () => {
    const stack = new TestableProjectStack({
      accounts: AccountStrategy.three({
        mock: { id: "123456789012" },
        dev: { id: "111111111111" },
        preprod: { id: "222222222222" },
        prod: { id: "333333333333" },
      }),
      accountType: AccountType.MOCK,
    });

    const result = AccountContext.isMock(stack);
    expect(result).toBe(true);
  });

  test("returns false for non-mock account", () => {
    const stack = new TestableProjectStack({
      accounts: AccountStrategy.three({
        dev: { id: "111111111111" },
        preprod: { id: "222222222222" },
        prod: { id: "333333333333" },
      }),
      accountType: AccountType.DEV,
    });

    const result = AccountContext.isMock(stack);
    expect(result).toBe(false);
  });
});

describe("isShared", () => {
  test("returns true for shared account", () => {
    const stack = new TestableProjectStack({
      accounts: AccountStrategy.one({
        mock: { id: "123456789012" },
        shared: { id: "111111111111" },
      }),
      accountType: AccountType.SHARED,
    });

    const result = AccountContext.isShared(stack);
    expect(result).toBe(true);
  });

  test("returns false for non-shared account", () => {
    const stack = new TestableProjectStack({
      accounts: AccountStrategy.three({
        dev: { id: "111111111111" },
        preprod: { id: "222222222222" },
        prod: { id: "333333333333" },
      }),
      accountType: AccountType.DEV,
    });

    const result = AccountContext.isShared(stack);
    expect(result).toBe(false);
  });
});

describe("isDev", () => {
  test("returns true for dev account", () => {
    const stack = new TestableProjectStack({
      accounts: AccountStrategy.three({
        dev: { id: "111111111111" },
        preprod: { id: "222222222222" },
        prod: { id: "333333333333" },
      }),
      accountType: AccountType.DEV,
    });

    const result = AccountContext.isDev(stack);
    expect(result).toBe(true);
  });

  test("returns false for non-dev account", () => {
    const stack = new TestableProjectStack({
      accounts: AccountStrategy.three({
        dev: { id: "111111111111" },
        preprod: { id: "222222222222" },
        prod: { id: "333333333333" },
      }),
      accountType: AccountType.PROD,
    });

    const result = AccountContext.isDev(stack);
    expect(result).toBe(false);
  });
});

describe("isPreProd", () => {
  test("returns true for preprod account", () => {
    const stack = new TestableProjectStack({
      accounts: AccountStrategy.three({
        dev: { id: "111111111111" },
        preprod: { id: "222222222222" },
        prod: { id: "333333333333" },
      }),
      accountType: AccountType.PREPROD,
    });

    const result = AccountContext.isPreProd(stack);
    expect(result).toBe(true);
  });

  test("returns false for non-preprod account", () => {
    const stack = new TestableProjectStack({
      accounts: AccountStrategy.three({
        dev: { id: "111111111111" },
        preprod: { id: "222222222222" },
        prod: { id: "333333333333" },
      }),
      accountType: AccountType.DEV,
    });

    const result = AccountContext.isPreProd(stack);
    expect(result).toBe(false);
  });
});

describe("isProd", () => {
  test("returns true for prod account", () => {
    const stack = new TestableProjectStack({
      accounts: AccountStrategy.three({
        dev: { id: "111111111111" },
        preprod: { id: "222222222222" },
        prod: { id: "333333333333" },
      }),
      accountType: AccountType.PROD,
    });

    const result = AccountContext.isProd(stack);
    expect(result).toBe(true);
  });

  test("returns false for non-prod account", () => {
    const stack = new TestableProjectStack({
      accounts: AccountStrategy.three({
        dev: { id: "111111111111" },
        preprod: { id: "222222222222" },
        prod: { id: "333333333333" },
      }),
      accountType: AccountType.DEV,
    });

    const result = AccountContext.isProd(stack);
    expect(result).toBe(false);
  });
});
