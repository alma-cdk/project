import {
  AccountType,
  emptyMockAccountProps,
  AccountStrategy,
} from "./accounts";

test("AccountType", () => {
  expect(AccountType).toMatchSnapshot();
});

test("emptyMockAccountProps", () => {
  expect(emptyMockAccountProps).toMatchSnapshot();
});

describe("AccountStrategy", () => {
  test("one", () => {
    expect(
      AccountStrategy.one({
        shared: {
          id: "123456789012",
          config: {
            key: "value",
          },
        },
      }),
    ).toMatchSnapshot();
  });

  test("two", () => {
    expect(
      AccountStrategy.two({
        dev: {
          id: "123456789012",
          config: {
            foo: "bar",
          },
        },
        prod: {
          id: "213456789012",
          config: {
            baz: "quux",
          },
        },
      }),
    ).toMatchSnapshot();
  });

  test("three", () => {
    expect(
      AccountStrategy.three({
        dev: {
          id: "111111111111",
          config: {
            cidr: "172.16.0.0/22",
          },
        },
        preprod: {
          id: "222222222222",
          config: {
            cidr: "172.16.4.0/22",
          },
        },
        prod: {
          id: "333333333333",
          config: {
            cidr: "172.16.8.0/22",
          },
        },
      }),
    ).toMatchSnapshot();
  });
});
