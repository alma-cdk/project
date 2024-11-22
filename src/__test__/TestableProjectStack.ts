import * as cdk from "aws-cdk-lib";
import {
  Project,
  SmartStack,
  AccountWrapper,
  EnvironmentWrapper,
  Account,
  AccountType,
} from "..";

interface TestStackInSharedAccountProps {
  defaultRegion?: string;
  accounts: Record<string, Account>;
  accountType: AccountType;
  environmentType?: string;
  stackProps?: cdk.StackProps;
}

export class TestableProjectStack extends SmartStack {
  public readonly projectName: string;
  public readonly stackConstructId: string;

  constructor(props: TestStackInSharedAccountProps) {
    const {
      accounts,
      accountType,
      environmentType,
      defaultRegion,
      stackProps,
    } = props;

    const projectName = "test-project";

    const project = new Project({
      name: projectName,
      author: {
        name: "test",
        email: "test@example.com",
      },
      defaultRegion,
      accounts,
    });

    project.node.setContext("account-type", accountType);
    project.node.setContext("account", accountType);

    let wrapper: AccountWrapper | EnvironmentWrapper;

    if (environmentType) {
      project.node.setContext("environment-type", environmentType);
      project.node.setContext("environment", environmentType);
      project.node.setContext("env", environmentType);
      wrapper = new EnvironmentWrapper(project);
    } else {
      wrapper = new AccountWrapper(project);
    }

    const stackConstructId = "TestStack";

    super(wrapper, stackConstructId, {
      description: "This stack is for testing purposes only",
      ...stackProps,
    });

    this.projectName = projectName;
    this.stackConstructId = stackConstructId;
  }
}
