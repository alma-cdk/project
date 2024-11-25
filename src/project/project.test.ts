import { Annotations } from "aws-cdk-lib";
import * as assertions from "aws-cdk-lib/assertions";
import { Construct } from "constructs";
import { TestableProjectStack } from "../__test__/TestableProjectStack";

describe("Acknowledge warnings", () => {
  test("warning present if not acknowledged", () => {
    const stack = new TestableProjectStack({
      accounts: {
        shared: {
          id: "111111111111",
        },
      },
      accountType: "shared",
    });

    const warningId = "my-test-warning";

    const withWarning = new Construct(stack, "WithWarning");
    Annotations.of(withWarning).addWarningV2(warningId, "don't do this");

    assertions.Annotations.fromStack(stack).hasWarning(
      "*",
      assertions.Match.stringLikeRegexp(warningId),
    );
  });

  test("acknowledges warnings", () => {
    const stack = new TestableProjectStack({
      accounts: {
        shared: {
          id: "111111111111",
        },
      },
      accountType: "shared",
    });

    const warningId = "my-test-warning";

    const withWarning = new Construct(stack, "WithWarning");
    Annotations.of(withWarning).addWarningV2(warningId, "don't do this");

    stack.project.acknowledgeWarnings([{ id: warningId, message: "is okay" }]);

    assertions.Annotations.fromStack(stack).hasNoWarning(
      "*",
      assertions.Match.stringLikeRegexp(warningId),
    );
  });
});
