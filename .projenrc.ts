import { cdk } from "projen";
import { AlmaCdkConstructLibrary } from "./AlmaCdkConstructLibrary";

const project = new AlmaCdkConstructLibrary({
  stability: cdk.Stability.STABLE,
  authorAddress: "opensource@almamedia.dev",
  name: "@alma-cdk/project",
  description: "Opinionated CDK Project “Framework”",
  repositoryUrl: "https://github.com/alma-cdk/project.git",
  majorVersion: 2,
  devDeps: ["@types/nunjucks"],
  bundledDeps: ["change-case", "nunjucks"],
});

project.synth();
