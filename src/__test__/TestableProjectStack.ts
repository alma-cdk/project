import {
  Project,
  SmartStack,
  AccountWrapper,
  EnvironmentWrapper,
  Account,
  AccountType,
} from "..";

interface TestStackInSharedAccountProps {
  accounts: Record<string, Account>;
  accountType: AccountType;
  environmentType?: string;
}

export class TestableProjectStack extends SmartStack {
  constructor(props: TestStackInSharedAccountProps) {
    const { accounts, accountType, environmentType } = props;

    const project = new Project({
      name: "test",
      author: {
        name: "test",
        email: "test@example.com",
      },
      accounts,
    });

    project.node.setContext("account-type", accountType);

    let wrapper: AccountWrapper | EnvironmentWrapper;

    if (environmentType) {
      project.node.setContext("environment-type", environmentType);
      wrapper = new EnvironmentWrapper(project);
    } else {
      wrapper = new AccountWrapper(project);
    }

    super(wrapper, "Test", {
      description: "This stack is for testing purposes only",
    });
  }
}
