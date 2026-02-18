import { awscdk, javascript } from "projen";
import { SonarCloudReportWorkflow } from "./SonarCloudReportWorkflow";
import { NodeConfig } from "./NodeConfig";
import { UpdateSnapshot } from "projen/lib/javascript";
import {
  almaCdkConstructLibraryOptionsSchema,
  type AlmaCdkConstructLibraryOptions,
} from "./schemas/almaCdkConstructLibraryOptions";
import { parseScopedPackageName } from "./schemas/name";

export type { AlmaCdkConstructLibraryOptions } from "./schemas/almaCdkConstructLibraryOptions";

const CDK_VERSION = "2.220.0";
const CONSTRUCTS_VERSION = "10.3.0";
const JSII_VERSION = "~5.9.0";
const JEST_VERSION = "^30";

export class AlmaCdkConstructLibrary extends awscdk.AwsCdkConstructLibrary {
  public readonly workflowNodeVersion: string;

  constructor(options: AlmaCdkConstructLibraryOptions) {
    const validatedOptions =
      almaCdkConstructLibraryOptionsSchema.parse(options);

    const { scope: packageScope, packageName } = parseScopedPackageName(
      validatedOptions.name,
    );

    const opts: awscdk.AwsCdkConstructLibraryOptions = {
      ...validatedOptions,
      // Package manager & projen
      projenCommand: "pnpm exec projen",
      authorOrganization: true,
      defaultReleaseBranch: "main",
      packageManager: javascript.NodePackageManager.PNPM,
      npmAccess: javascript.NpmAccess.PUBLIC,
      npmTrustedPublishing: true,
      projenrcTs: true,
      jsiiVersion: JSII_VERSION,
      keywords: ["cdk", "aws-cdk", "awscdk", "aws"],
      jestOptions: {
        jestVersion: JEST_VERSION,
        updateSnapshot: UpdateSnapshot.NEVER,
      },
      // Code quality (Prettier)
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
      // Publishing
      publishToPypi: {
        distName: `${packageScope}.${packageName}`,
        module: `${packageScope.replace("-", "_")}.${packageName.replace("-", "_")}`,
        trustedPublishing: true,
      },
      publishToGo: {
        moduleName: `${validatedOptions.repositoryUrl.replace("https://", "").replace(".git", "")}-go`,
      },
      // CDK
      cdkVersion: CDK_VERSION,
      constructsVersion: CONSTRUCTS_VERSION,
      // Git & dev
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
        include: ["AlmaCdkConstructLibrary/**/*.ts"],
      },
    };

    super(opts);

    // Schema default ensures this is set
    this.workflowNodeVersion = validatedOptions.workflowNodeVersion!;

    this.addDevDeps("typescript@^5.9"); // Defaults to very old typescript@4.9
    this.addDevDeps("@types/semver@^7");
    this.addDevDeps("json-schema-to-typescript@^15");

    this.addBundledDeps("zod@4");
    this.addBundledDeps("semver@7");

    this.addTask("format", {
      exec: "prettier --write .",
    });

    this.addTask("generate:pnpm-workspace-types", {
      description:
        "Download pnpm-workspace JSON schema and generate pnpm-workspace-schema.d.ts",
      exec: "ts-node scripts/generate-pnpm-workspace-types.ts",
    });

    new SonarCloudReportWorkflow(this);

    new NodeConfig(this);
  }
}
