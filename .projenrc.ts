import { AlmaCdkConstructLibrary } from "@alma-cdk/construct-library";
import { cdk } from "projen";

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
  sonarProjectPropertiesExtraLines: [
    "sonar.issue.ignore.multicriteria=e1,e2",
    "sonar.issue.ignore.multicriteria.e1.ruleKey=typescript:S1874",
    "sonar.issue.ignore.multicriteria.e1.resourceKey=src/smartstack/tags/*.ts",
    "sonar.issue.ignore.multicriteria.e2.ruleKey=typescript:S1874",
    "sonar.issue.ignore.multicriteria.e2.resourceKey=src/project/deprecation-warnings.ts",
  ],
});

project.synth();
