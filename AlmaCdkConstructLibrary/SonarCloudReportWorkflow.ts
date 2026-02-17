import { awscdk } from "projen";
import { WorkflowSteps } from "projen/lib/github";
import { JobPermission } from "projen/lib/github/workflows-model";



export class SonarCloudReportWorkflow {
    constructor(project: awscdk.AwsCdkConstructLibrary) {

        const sonarCloudReportWorkflow = project.github?.addWorkflow("sonarcloud-report");
        
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
    }
}