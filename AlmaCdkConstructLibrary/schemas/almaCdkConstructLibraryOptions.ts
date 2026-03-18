import { awscdk, cdk } from "projen";
import { z } from "zod";
import { nameSchema } from "./name";
import { repositoryUrlSchema } from "./repositoryUrl";
import semver from "semver";

/** Positive integer (≥ 1) */
const positiveInteger = z.number().int().positive();

/** Semver string: validates that the value can be coerced into a valid semver (via semver.coerce + semver.valid). Returns the original string unchanged. */
const semverSchema = z.string().refine(
  (s) => {
    const coerced = semver.coerce(s);
    return coerced != null && semver.valid(coerced) != null;
  },
  { message: "Must be a valid semver or coercible to one" },
);

function validateNodeVersionOrder(opts: {
  minNodeVersion: string;
  maxNodeVersion: string;
  workflowNodeVersion: string;
}): boolean {
  const min = semver.coerce(opts.minNodeVersion);
  const max = semver.coerce(opts.maxNodeVersion);
  const workflow = semver.coerce(opts.workflowNodeVersion);
  if (min == null || max == null || workflow == null) return true; // let field-level validation handle invalid semver
  return (
    semver.lte(min, max) &&
    semver.lte(min, workflow) &&
    semver.lte(workflow, max)
  );
}

/** Options for a release branch (matches projen BranchOptions) */
export const branchOptionsSchema = z.object({
  workflowName: z.string().optional(),
  environment: z.string().optional(),
  majorVersion: positiveInteger,
  minMajorVersion: positiveInteger.optional(),
  minorVersion: positiveInteger.optional(),
  prerelease: z.string().optional(),
  tagPrefix: z.string().optional(),
  npmDistTag: z.string().optional(),
});

/** Projen AwsCdkConstructLibrary options with validation and defaults (min/max/workflow Node versions, scoped name, etc.). */
export const almaCdkConstructLibraryOptionsSchema = z
  .object({
    stability: z.enum(cdk.Stability),
    majorVersion: positiveInteger,
    author: z.string(),
    authorAddress: z.email(),
    name: nameSchema,
    description: z.string(),
    repositoryUrl: repositoryUrlSchema,
    releaseBranches: z.record(z.string(), branchOptionsSchema).optional(),
    releaseEnvironment: z.string(),
    deps: z.array(z.string()).optional(),
    devDeps: z.array(z.string()).optional(),
    bundledDeps: z.array(z.string()).optional(),
    minNodeVersion: semverSchema.default("20"),
    workflowNodeVersion: semverSchema.default("24"),
    maxNodeVersion: semverSchema.default("24"),
  })
  .refine(validateNodeVersionOrder, {
    message: "Node versions must satisfy min <= workflow <= max",
  }) satisfies z.ZodType<Partial<awscdk.AwsCdkConstructLibraryOptions>>;

export type AlmaCdkConstructLibraryOptions = z.input<
  typeof almaCdkConstructLibraryOptionsSchema
>;
