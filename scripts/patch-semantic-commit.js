import fs from "node:fs";
import { join } from "node:path";

const path = join(
  "node_modules",
  "@semantic-release",
  "npm",
  "lib",
  "verify-auth.js"
);

export function patchSemanticCommit() {
  const contents = fs.readFileSync(path, "utf8");
  const patched = contents.replace(
    `execa('npm', ['whoami', '--userconfig', npmrc, '--registry', registry]`,
    `execa('npm', ['whoami', '--userconfig', npmrc, '--registry', registry, '--no-workspaces']`
  );
  fs.writeFileSync(path, patched, "utf8");
}
