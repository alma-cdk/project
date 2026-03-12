/**
 * Fetches the pnpm-workspace JSON schema from SchemaStore and generates a .d.ts file.
 * Run via: pnpm exec ts-node scripts/generate-pnpm-workspace-types.ts
 */
import { writeFileSync } from "fs";
import { compile } from "json-schema-to-typescript";
import { join } from "path";

const SCHEMA_URL = "https://json.schemastore.org/pnpm-workspace.json";
const OUTPUT_FILE = "AlmaCdkConstructLibrary/pnpm-workspace-schema.d.ts";

async function main(): Promise<void> {
  const res = await fetch(SCHEMA_URL);
  if (!res.ok) {
    throw new Error(`Failed to fetch schema: ${res.status} ${res.statusText}`);
  }
  const schema = (await res.json()) as object;
  const ts = await compile(schema, "PnpmWorkspace", {
    bannerComment: `/**
 * TypeScript definitions for pnpm-workspace.yaml (JSON Schema from ${SCHEMA_URL})
 * DO NOT EDIT BY HAND. Run \`pnpm run generate:pnpm-workspace-types\` to regenerate.
 */`,
    additionalProperties: false,
  });
  const outPath = join(process.cwd(), OUTPUT_FILE);
  writeFileSync(outPath, ts, "utf8");
  console.log(`Wrote ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
