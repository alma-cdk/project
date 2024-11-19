import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { Template } from "aws-cdk-lib/assertions";

interface TestableResourceProps {
  id?: string;
  scope?: Construct;
  context?: Record<string, unknown>;
}

/**
 * A helper class that allows easier testing.
 */
export class TestableResource extends cdk.Resource implements cdk.ITaggable {
  static readonly TYPE = "For::Testing";

  public readonly tags = new cdk.TagManager(
    cdk.TagType.KEY_VALUE,
    TestableResource.TYPE
  );

  constructor(props: TestableResourceProps = {}) {
    const { id = "TestScope", scope = new cdk.Stack(), context = {} } = props;

    Object.entries(context).forEach(([key, value]) => {
      scope.node.setContext(key, value);
    });

    super(scope, id);

    new cdk.CfnResource(this, "Resource", {
      type: TestableResource.TYPE,
      properties: {
        Tags: this.tags.renderedTags,
      },
    });
  }

  public hasProperties(props: Record<string, unknown>) {
    const template = Template.fromStack(cdk.Stack.of(this));
    template.hasResourceProperties(TestableResource.TYPE, props);
  }
}
