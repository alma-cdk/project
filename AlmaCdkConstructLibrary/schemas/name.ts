import { z } from "zod";

/** Scoped package name: must be @<scope>/<package-name> (single slash) */
export const nameSchema = z
  .string()
  .min(1)
  .refine(
    (name) => name.startsWith("@") && name.split("/").length === 2,
    {
      message: 'Name must be a scoped package starting with "@" and contain exactly one "/"',
    },
  );
