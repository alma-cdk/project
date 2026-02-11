import { awscdk, javascript, TextFile, cdk } from "projen";
import { WorkflowSteps } from "projen/lib/github";
import { JobPermission } from "projen/lib/github/workflows-model";

const nodejsVersion = {
  /**
   * Minimum supported version.
   */
  MIN: "20",
  /**
   * Maximum supported version.
   */
  MAX: "24",
} as const;

const project = new awscdk.AwsCdkConstructLibrary({
  minNodeVersion: nodejsVersion.MIN,
  maxNodeVersion: nodejsVersion.MAX,
  projenrcTs: true,
  jsiiVersion: "~5.8.0",
  // Metadata
  stability: cdk.Stability.STABLE,
  author: "Alma Media",
  authorOrganization: true,
  authorAddress: "opensource@almamedia.dev",
  name: "@alma-cdk/project",
  description: "Opinionated CDK Project “Framework”",
  repositoryUrl: "https://github.com/alma-cdk/project.git",
  keywords: ["cdk", "aws-cdk", "awscdk", "aws"],
  prettier: true,
  prettierOptions: {
    ignoreFileOptions: {
      ignorePatterns: [
        ".github/**/*",
        ".projen/**/*",
        ".vscode/**/*",
        "coverage/**/*",
        "dist/**/*",
        "/*.*",
        "!.projenrc.ts",
      ],
    },
  },

  // Publish configuration
  majorVersion: 2,
  defaultReleaseBranch: "main",
  packageManager: javascript.NodePackageManager.NPM,
  npmAccess: javascript.NpmAccess.PUBLIC,
  npmTrustedPublishing: true,
  releaseEnvironment: "production",
  publishToPypi: {
    distName: "alma-cdk.project",
    module: "alma_cdk.project",
    trustedPublishing: true,
  },
  publishToGo: {
    moduleName: "github.com/alma-cdk/project-go",
  },

  // Dependencies
  cdkVersion: "2.220.0",
  constructsVersion: "10.3.0",
  devDeps: ["@types/nunjucks", `@types/node@^${nodejsVersion.MIN}`],
  bundledDeps: ["change-case", "nunjucks"],

  // Gitignore
  gitignore: [
    ".DS_Store",
    "/examples/**/cdk.context.json",
    "/examples/**/node_modules",
    "/examples/**/cdk.out",
    "/examples/**/.git",
    "TODO.md",
    ".scannerwork/",
    "**/*.drawio.bkp",
    "**/*.afdesign~lock~",
  ],
});

project.addTask("format", {
  exec: "prettier --write .",
});

/**
 * Sonarcloud report workflow
 */
const sonarCloudReportWorkflow =
  project.github?.addWorkflow("sonarcloud-report");
sonarCloudReportWorkflow?.on({
  push: { branches: ["main", "beta"] },
  pullRequest: {
    types: ["opened", "synchronize", "reopened"],
  },
});
sonarCloudReportWorkflow?.addJob("sonarcloud-report", {
  runsOn: ["ubuntu-latest"],
  permissions: {
    contents: JobPermission.READ,
  },
  steps: [
    WorkflowSteps.checkout({
      with: {
        fetchDepth: 0,
      },
    }),
    ...project.renderWorkflowSetup(),
    {
      name: "Run tests",
      run: "npm run test",
    },
    {
      name: "SonarCloud Scan",
      uses: "SonarSource/sonarqube-scan-action@7",
      env: {
        GITHUB_TOKEN: "${{ secrets.GITHUB_TOKEN }}",
        SONAR_TOKEN: "${{ secrets.SONAR_TOKEN }}",
      },
    },
  ],
});

/**
 * Sonarcloud properties file
 */
new TextFile(project, "sonar-project.properties", {
  lines: [
    "sonar.host.url=https://sonarcloud.io",
    `sonar.projectKey=${project.name.replace("@", "").replace("/", "_")}`,
    `sonar.organization=${project.name.replace("@", "").split("/")[0]}`,
    "sonar.javascript.lcov.reportPaths=./coverage/lcov.info",
    "sonar.sources=./src",
    "sonar.tests=./test",
    "sonar.test.inclusions=**/*.test.*",
    "sonar.issue.ignore.multicriteria=e1,e2",
    "sonar.issue.ignore.multicriteria.e1.ruleKey=typescript:S1874",
    "sonar.issue.ignore.multicriteria.e1.resourceKey=src/smartstack/tags/*.ts",
    "sonar.issue.ignore.multicriteria.e2.ruleKey=typescript:S1874",
    "sonar.issue.ignore.multicriteria.e2.resourceKey=src/project/deprecation-warnings.ts",
  ],
});

/**
 * .nvmrc file
 */
new TextFile(project, ".nvmrc", {
  lines: [nodejsVersion.MIN],
});

project.synth();
