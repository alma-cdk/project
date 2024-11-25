import { env } from "process";
import { Stack, StackProps, Annotations } from "aws-cdk-lib";
import { Construct } from "constructs";
import { formatDescription } from "./description";
import { formatName } from "./name";
import { addTags } from "./tags";
import { decideTerminationProtection } from "./termination";
import { addError } from "../error";
import {
  LEGACY_TAGS_CONTEXT_KEY,
  useCompatibilityV0Tags,
  useLegacyTags,
  V0_TAGS_CONTEXT_KEY,
} from "../feature-flags";
import { ProjectContext } from "../project";

export class SmartStack extends Stack {
  private readonly descriptionMinLength: number = 12;
  private readonly descriptionMaxLength: number = 280;

  constructor(scope: Construct, id: string, props: StackProps) {
    // TypeScript rule TS2376 requires that super must be the first call in a
    // derivative class. Hence we must resolve values "inline" within inside the
    // super call:
    // https://github.com/microsoft/TypeScript/issues/8277
    // https://github.com/microsoft/TypeScript/issues/945
    super(scope, id, {
      // Set the Stack "base props" (most of them will be overriden below)
      ...props,

      stackName: formatName({
        override: props?.stackName,
        stackId: id,
        projectName: ProjectContext.getName(scope),
        accountType: ProjectContext.getAccountType(scope),
        environmentType: ProjectContext.tryGetEnvironment(scope) || "",
      }),

      description: formatDescription({
        body: props.description!,
        accountType: ProjectContext.getAccountType(scope),
        environmentType: ProjectContext.tryGetEnvironment(scope) || "",
      }),

      terminationProtection: decideTerminationProtection({
        override: props?.terminationProtection,
        environmentType: ProjectContext.tryGetEnvironment(scope) || "",
      }),

      env: {
        ...env, // for future-proofing purposes in case CDK adds new fields
        account: props?.env?.account || ProjectContext.getAccountId(scope),
        region: props?.env?.region || ProjectContext.getDefaultRegion(scope),
      },
    });

    this.validateDescriptionMinLength(props);
    this.validateDescriptionMaxLength(props);

    addTags(this);

    if (useLegacyTags(this)) {
      Annotations.of(this).addWarningV2(
        "@alma-cdk/project@v1:legacy-tags",
        `Using @almamedia-cdk/tag-and-name (for AWS CDK v1) construct's legacy tagging behavior via "${LEGACY_TAGS_CONTEXT_KEY}" context key. This is not encouraged and will be removed in v2.`,
      );
    }

    if (useCompatibilityV0Tags(this)) {
      Annotations.of(this).addWarningV2(
        "@alma-cdk/project@v1:compatibility-v0-tags",
        `Using @alma-cdk/project@v0 construct's tagging behavior via "${V0_TAGS_CONTEXT_KEY}" context key. You should migrate to using the default tagging behavior as this feature flag will be removed in v2.`,
      );
    }
  }

  private validateDescriptionMinLength(props: StackProps) {
    if (
      typeof props.description !== "string" ||
      props.description.length < this.descriptionMinLength
    ) {
      addError(
        this,
        `Description is required and should be at least ${this.descriptionMinLength} characters`,
      );
    }
  }

  private validateDescriptionMaxLength(props: StackProps) {
    if (
      typeof props.description === "string" &&
      props.description.length > this.descriptionMaxLength
    ) {
      addError(
        this,
        `Description is should be at max ${this.descriptionMaxLength} characters`,
      );
    }
  }
}
