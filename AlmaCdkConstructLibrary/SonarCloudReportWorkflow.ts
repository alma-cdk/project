import { awscdk, TextFile } from "projen";
import { WorkflowSteps } from "projen/lib/github";
import { JobPermission } from "projen/lib/github/workflows-model";

export class SonarCloudReportWorkflow {
  constructor(project: awscdk.AwsCdkConstructLibrary) {
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
          run: "pnpm run test",
        },
        {
          name: "SonarCloud Scan",
          uses: "SonarSource/sonarqube-scan-action@v7",
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
  }
}
