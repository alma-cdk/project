import { cdk } from "projen";
import { AlmaCdkConstructLibrary } from "./AlmaCdkConstructLibrary";

const project = new AlmaCdkConstructLibrary({
  name: "@alma-cdk/project",
  author: "Alma Media",
  authorAddress: "opensource@almamedia.dev",
  description: "Opinionated CDK Project “Framework”",
  repositoryUrl: "https://github.com/alma-cdk/project.git",
  stability: cdk.Stability.STABLE,
  majorVersion: 2,
  devDeps: ["@types/nunjucks"],
  bundledDeps: ["change-case", "nunjucks"],
  releaseEnvironment: "production",
});

project.synth();
