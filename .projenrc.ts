import { AlmaCdkConstructLibrary } from "@alma-cdk/construct-library";
import { cdk } from "projen";

const MAJOR_VERSION = 3;
const NEXT_MAJOR_VERSION = MAJOR_VERSION + 1;

const project = new AlmaCdkConstructLibrary({
  name: "@alma-cdk/project",
  author: "Alma Media",
  authorAddress: "opensource@almamedia.dev",
  description: "Opinionated CDK Project “Framework”",
  repositoryUrl: "https://github.com/alma-cdk/project.git",
  stability: cdk.Stability.STABLE,
  majorVersion: MAJOR_VERSION,
  devDeps: ["@types/nunjucks"],
  bundledDeps: ["change-case", "nunjucks"],
  releaseEnvironment: "production",
  releaseBranches: {
    [`${NEXT_MAJOR_VERSION}.x`]: {
      majorVersion: NEXT_MAJOR_VERSION,
      prerelease: "beta",
    },
  },
  sonarProjectPropertiesExtraLines: [
    "sonar.issue.ignore.multicriteria=e1,e2",
    "sonar.issue.ignore.multicriteria.e1.ruleKey=typescript:S1874",
    "sonar.issue.ignore.multicriteria.e1.resourceKey=src/smartstack/tags/*.ts",
    "sonar.issue.ignore.multicriteria.e2.ruleKey=typescript:S1874",
    "sonar.issue.ignore.multicriteria.e2.resourceKey=src/project/deprecation-warnings.ts",
  ],
});

project.synth();
