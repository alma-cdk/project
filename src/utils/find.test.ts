import { findAccountTypeByEnvironment } from "./find";
import { AccountStrategy } from "../configurations";

describe("Find account-type", () => {
  const props = {
    name: "my-cool-project",
    author: {
      organization: "Acme Corp",
      name: "Mad Scientists",
      email: "mad.scientists@acme.example.com",
    },
    defaultRegion: "eu-west-1",
    accounts: AccountStrategy.two({
      dev: {
        id: "111111111111",
      },
      prod: {
        id: "222222222222",
      },
    }),
  };

  test("match/none", () => {
    expect(findAccountTypeByEnvironment(props.accounts, "unknown")).toBe(
      undefined,
    );
  });

  test("match/dev", () => {
    expect(findAccountTypeByEnvironment(props.accounts, "development")).toBe(
      "dev",
    );
    expect(findAccountTypeByEnvironment(props.accounts, "feature/abc")).toBe(
      "dev",
    );
    expect(findAccountTypeByEnvironment(props.accounts, "test")).toBe("dev");
    expect(findAccountTypeByEnvironment(props.accounts, "staging")).toBe("dev");
  });

  test("match/prod", () => {
    expect(findAccountTypeByEnvironment(props.accounts, "preproduction")).toBe(
      "prod",
    );
    expect(findAccountTypeByEnvironment(props.accounts, "production")).toBe(
      "prod",
    );
  });
});
