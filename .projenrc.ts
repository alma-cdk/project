import { cdk } from "projen";
import { AlmaCdkConstructLibrary } from "./AlmaCdkConstructLibrary";

const nodejsVersion = {
  /**
   * Minimum supported version.
   */
  MIN: "20",

  /**
   * Version used for GitHub Actions workflows.
   * This is required due to OIDC & trusted publishing.
   * Has to be used also for local development to avoid
   * package-lock.json mutation check fail on CI.
   */
  WORKFLOW: "24",
  /**
   * Maximum supported version.
   */
  MAX: "24",
} as const;

const project = new AlmaCdkConstructLibrary({
  stability: cdk.Stability.STABLE,
  authorAddress: "opensource@almamedia.dev",
  name: "@alma-cdk/project",
  description: "Opinionated CDK Project “Framework”",
  repositoryUrl: "https://github.com/alma-cdk/project.git",
  majorVersion: 2,
  devDeps: ["@types/nunjucks", `@types/node@^${nodejsVersion.MIN}`], // todo node types from base construct
  bundledDeps: ["change-case", "nunjucks"],
});

project.synth();
