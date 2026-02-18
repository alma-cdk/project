import { z } from "zod";

/** Scoped package name: must be @<scope>/<package-name> (single slash) */
export const nameSchema = z
  .string()
  .min(1)
  .refine((name) => name.startsWith("@") && name.split("/").length === 2, {
    message:
      'Name must be a scoped package starting with "@" and contain exactly one "/"',
  });

/**
 * Parse a scoped package name into scope and package name.
 * Input must already match nameSchema (e.g. @scope/package-name).
 */
export function parseScopedPackageName(name: string): {
  scope: string;
  packageName: string;
} {
  const withoutAt = name.replace("@", "");
  const [scope, packageName] = withoutAt.split("/");
  return { scope: scope!, packageName: packageName! };
}
