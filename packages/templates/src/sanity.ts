import {
  PluginType,
  exec,
  getMonorepoDirectory,
  readPackage,
  removeDirectory,
  writePackage,
  type TemplateArgs,
} from "@mokr/core";
import { basename, dirname } from "node:path";

async function apply({ directory }: TemplateArgs) {
  const monorepoDirectory = await getMonorepoDirectory({ directory });
  const oldPackage = await readPackage({ directory });

  await removeDirectory({ directory });

  await exec(
    "yarn",
    [
      "dlx",
      "create-sanity",
      "--output-path",
      directory,
      "--create-project",
      monorepoDirectory
        ? `${basename(monorepoDirectory)}-project` // Workaround for duplicate workspace name
        : basename(directory),
      "--dataset-default",
      "--typescript",
      "--template",
      "clean",
    ],
    {
      cwd: dirname(directory),
      io: "passthrough",
    },
  );

  await writePackage({ directory, data: oldPackage });
}

// @todo repo not supported atm, because we'd need to restore yarn and git state
export const sanity = {
  type: PluginType.Workspace,
  interactive: true,
  apply,
};
