import { awscdk, javascript } from "projen";
import { SonarCloudReportWorkflow } from "./SonarCloudReportWorkflow";
import { NodeConfig } from "./NodeConfig";
import { UpdateSnapshot } from "projen/lib/javascript";
import { almaCdkConstructLibraryOptionsSchema, type AlmaCdkConstructLibraryOptions } from "./schemas/almaCdkConstructLibraryOptions";

export type { AlmaCdkConstructLibraryOptions } from "./schemas/almaCdkConstructLibraryOptions";

// const nodejsVersion = {
//   /**
//    * Minimum supported version.
//    */
//   MIN: "20",

//   /**
//    * Version used for GitHub Actions workflows.
//    * This is required due to OIDC & trusted publishing.
//    * Has to be used also for local development to avoid
//    * package-lock.json mutation check fail on CI.
//    */
//   WORKFLOW: "24",
//   /**
//    * Maximum supported version.
//    */
//   MAX: "24",
// } as const;

// export interface AlmaCdkConstructLibraryOptions {
//   stability: cdk.Stability;
//   majorVersion: number;
//   author: string;
//   authorAddress: string;
//   name: string; // TODO validate scope
//   description: string;
//   repositoryUrl: string;
//   releaseBranches?: awscdk.AwsCdkConstructLibraryOptions["releaseBranches"];
//   releaseEnvironment: string;
//   deps?: string[];
//   devDeps?: string[];
//   bundledDeps?: string[];
// }


export class AlmaCdkConstructLibrary extends awscdk.AwsCdkConstructLibrary {
  public readonly workflowNodeVersion: string;

  constructor(options: AlmaCdkConstructLibraryOptions) {

    const validatedOptions = almaCdkConstructLibraryOptionsSchema.parse(options);


    const [packageScope, packageName] = validatedOptions.name
      .replace("@", "")
      .split("/");

    const opts: awscdk.AwsCdkConstructLibraryOptions = {
      ...validatedOptions,
      authorOrganization: true,
      jestOptions: {
        updateSnapshot: UpdateSnapshot.NEVER,
      },
      // minNodeVersion: nodejsVersion.MIN,
      // maxNodeVersion: nodejsVersion.MAX,
      // workflowNodeVersion: nodejsVersion.WORKFLOW,
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
      publishToPypi: {
        distName: `${packageScope}.${packageName}`,
        module: `${packageScope.replace("-", "_")}.${packageName.replace("-", "_")}`,
        trustedPublishing: true,
      },
      publishToGo: {
        moduleName: `${validatedOptions.repositoryUrl.replace("https://", "").replace(".git", "")}-go`,
      },

      // Dependencies
      cdkVersion: "2.220.0",
      constructsVersion: "10.3.0",
      deps: [...(validatedOptions.deps || []), "zod@4", "semver@7"],
      devDeps: [...(validatedOptions.devDeps || []), `@types/node@^${validatedOptions.minNodeVersion}`, `@types/semver@^7`],
      bundledDeps: [...(validatedOptions.bundledDeps || []), "zod@4", "semver@7"],

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

      tsconfigDev: {
        include: [
          "AlmaCdkConstructLibrary/**/*.ts",
        ],
      },
    };

    super(opts);

    this.workflowNodeVersion = validatedOptions.workflowNodeVersion!;

    this.addTask("format", {
      exec: "prettier --write .",
    });

    new SonarCloudReportWorkflow(this);

    new NodeConfig(this);
  }
}
