import { Duration } from "aws-cdk-lib";
import { awscdk, javascript, TextFile, cdk } from "projen";
import { SonarCloudReportWorkflow } from "./AlmaCdkConstructLibrary/SonarCloudReportWorkflow";


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

export interface AlmaCdkConstructLibraryOptions {
  stability: cdk.Stability,
  majorVersion: number,
  authorAddress: string,
  name: string, // TODO validate scope
  description: string,
  repositoryUrl: string,
  releaseBranches?: awscdk.AwsCdkConstructLibraryOptions['releaseBranches'],
  devDeps: string[],
  bundledDeps: string[],
}

export class AlmaCdkConstructLibrary extends awscdk.AwsCdkConstructLibrary {

  public readonly workflowNodeVersion: string;
  
  constructor(options: AlmaCdkConstructLibraryOptions) {
    
    const opts = {
      ...options,
      author: "Alma Media",
      authorOrganization: true,

      minNodeVersion: nodejsVersion.MIN,
      maxNodeVersion: nodejsVersion.MAX,
      workflowNodeVersion: nodejsVersion.WORKFLOW,
      projenrcTs: true,
      jsiiVersion: "~5.8.0",
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
      
      defaultReleaseBranch: "main",
      packageManager: javascript.NodePackageManager.PNPM,
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
      // devDeps: ["@types/nunjucks", `@types/node@^${nodejsVersion.MIN}`],
      // bundledDeps: ["change-case", "nunjucks"],

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
    };
    
    super(opts);

    this.workflowNodeVersion = opts.workflowNodeVersion;

    this.addTask("format", {
      exec: "prettier --write .",
    });

    new SonarCloudReportWorkflow(this);

    /**
    * Sonarcloud properties file
    */
    new TextFile(this, "sonar-project.properties", {
      lines: [
        "sonar.host.url=https://sonarcloud.io",
        `sonar.projectKey=${this.name.replace("@", "").replace("/", "_")}`,
        `sonar.organization=${this.name.replace("@", "").split("/")[0]}`,
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
    new TextFile(this, ".nvmrc", {
      lines: [nodejsVersion.WORKFLOW],
    });

    /**
    * pnpm-workspace.yaml configuration
    */
    new TextFile(this, "pnpm-workspace.yaml", {
      lines: [
        `minimumReleaseAge: ${Duration.days(3).toMinutes()}`,
        "trustPolicy: no-downgrade",
        `trustPolicyIgnoreAfter: ${Duration.days(30).toMinutes()}`,
        "nodeLinker: hoisted", // required for bundled deps
        "resolutionMode: highest",
        "strictDepBuilds: true",
        "blockExoticSubdeps: true",
      ],
    });
  }
}