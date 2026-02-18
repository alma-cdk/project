import { TextFile, awscdk, YamlFile } from "projen";
import { Duration } from "aws-cdk-lib";
import { PnpmWorkspaceSpecification } from "./pnpm-workspace-schema";

export interface NodeConfigOptions {
  workflowNodeVersion: string;
}

export class NodeConfig {
  /**
   * @param project - The CDK construct library project; must expose `workflowNodeVersion` (e.g. AlmaCdkConstructLibrary).
   */
  constructor(project: awscdk.AwsCdkConstructLibrary & NodeConfigOptions) {
    new TextFile(project, ".nvmrc", {
      lines: [project.workflowNodeVersion],
    });

    new YamlFile(project, "pnpm-workspace.yaml", {
      obj: {
        minimumReleaseAge: Duration.days(3).toMinutes(),
        trustPolicy: "no-downgrade",
        trustPolicyIgnoreAfter: Duration.days(14).toMinutes(),
        trustPolicyExclude: ["jsii@5.9.26"],
        nodeLinker: "hoisted", // required for bundled deps
        resolutionMode: "highest",
        strictDepBuilds: true,
        blockExoticSubdeps: true,
        overrides: {
          "ajv@^8": "^8.18.0",
        },
      } as PnpmWorkspaceSpecification,
    });
  }
}
