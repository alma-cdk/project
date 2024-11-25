import { Construct } from "constructs";
import { EnvRegExp } from "./envregexp";
import { addError } from "../error";

/**
 * Internal class to handle set/get operations for Environment Type
 */
export class EnvironmentType {
  static set(scope: Construct, environmentType: string): void {
    scope.node.setContext("environment-type", environmentType);
    scope.node.setContext("environment", environmentType);
    scope.node.setContext("env", environmentType);
  }

  static tryGet(scope: Construct): string | undefined {
    const environmentType =
      scope.node.tryGetContext("environment-type") ||
      scope.node.tryGetContext("environment") ||
      scope.node.tryGetContext("env");

    return environmentType;
  }

  static get(scope: Construct, allowedEnvironments: string[]): string {
    const environmentType = EnvironmentType.tryGet(scope);

    if (typeof environmentType !== "string") {
      addError(
        scope,
        "Environment Type not specified! Provide environment type as context argument for CDK CLI, for example: --context environment-type=staging",
      );
      return "";
    }

    const matches = allowedEnvironments.filter((e) =>
      new EnvRegExp(e).test(environmentType),
    );

    if (matches.length < 1) {
      addError(
        scope,
        `Environment Type ${environmentType} not allowed in your configuration`,
      );
      return "";
    }

    return environmentType;
  }
}
