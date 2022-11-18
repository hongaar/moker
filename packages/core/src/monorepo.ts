import fs from "node:fs";
import { readPackage, writePackage } from "./package.js";
import { initYarn } from "./yarn.js";

export const DEFAULT_SCOPED = true;
export const DEFAULT_LICENSE = "MIT";
export const DEFAULT_INITIAL_VERSION = "0.0.0";
export const DEFAULT_WORKSPACES_DIRECTORY = "packages";

type CreateMonorepoOptions = {
  directory: string;
  scoped?: boolean;
  license?: string;
  initialVersion?: string;
  workspacesDirectory?: string;
};

export async function createMonorepo({
  directory,
  scoped = DEFAULT_SCOPED,
  license = DEFAULT_LICENSE,
  initialVersion = DEFAULT_INITIAL_VERSION,
  workspacesDirectory = DEFAULT_WORKSPACES_DIRECTORY,
}: CreateMonorepoOptions) {
  if (fs.existsSync(directory)) {
    throw new Error(`${directory} already exists`);
  }

  fs.mkdirSync(directory);

  await initYarn({ directory });
  await writePackage({
    directory,
    data: {
      private: true,
      license,
      workspaces: [`${workspacesDirectory}/*`],
      mokr: {
        scoped,
      },
    },
  });

  // execSync("git init", { cwd: directory });

  // yarn
  // yarn init -2
  // run steps in migration guide: https://yarnpkg.com/getting-started/migration
  // yarn plugin import interactive-tools
  // yarn plugin import typescript
  // yarn plugin import workspace-tools
  // await plugins.npmPackage(monorepo, {
  //   name: monorepo.name,
  //   license,
  //   workspaces,
  //   mokr: {
  //     scoped,
  //   },
  // });
  // await plugins.lerna(monorepo, {
  //   version,
  //   workspaces,
  // });
  // await plugins.typescript(monorepo);
  // await plugins.readme(monorepo);
  // await plugins.gitignore(monorepo);
  // await plugins.jest(monorepo);
  // await plugins.prettier(monorepo, "*.{ts,tsx}");

  // await monorepo.installQueue();
}

export async function isMonorepo({ directory }: { directory: string }) {
  return typeof (await readPackage({ directory })).mokr !== "undefined";
}
