import { z } from "zod";

/** GitHub repository URL: must start with https://github.com/ and end with .git */
export const repositoryUrlSchema = z
  .string()
  .url()
  .refine(
    (url) => url.startsWith("https://github.com/") && url.endsWith(".git"),
    {
      message:
        'Repository URL must start with "https://github.com/" and end with ".git"',
    },
  );
