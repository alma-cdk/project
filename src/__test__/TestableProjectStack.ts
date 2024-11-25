import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
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
  appContext?: Record<string, any>;
}

class TestContextProvider extends Construct {
  constructor(
    scope: Construct,
    id: string,
    appContext: Record<string, any> = {},
  ) {
    super(scope, id);

    Object.entries(appContext).forEach(([key, value]) => {
      this.node.setContext(key, value);
    });
  }
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
      appContext,
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

    const ctx: Record<string, any> = {};

    if (typeof environmentType === "string") {
      ctx["environment-type"] = environmentType;
      ctx.environment = environmentType;
      ctx.env = environmentType;
    }

    const testContextProvider = new TestContextProvider(
      project,
      "TestContextProvider",
      {
        ...appContext,
        "account-type": accountType,
        account: accountType,
        ...ctx,
      },
    );

    let wrapper: AccountWrapper | EnvironmentWrapper;

    if (typeof environmentType === "string") {
      wrapper = new EnvironmentWrapper(testContextProvider);
    } else {
      wrapper = new AccountWrapper(testContextProvider);
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
