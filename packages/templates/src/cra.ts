import {
  PluginType,
  exec,
  getMonorepoDirectory,
  readPackage,
  removeDirectory,
  removeFile,
  writePackage,
  type TemplateArgs,
} from "@mokr/core";
import { basename, dirname, join } from "node:path";

async function apply({ directory }: TemplateArgs) {
  const monorepoDirectory = await getMonorepoDirectory({ directory });
  const oldPackage = await readPackage({ directory });

  await removeDirectory({ directory });

  await exec(
    "yarn",
    [
      "dlx",
      "create-react-app",
      basename(directory),
      "--template",
      "typescript",
    ],
    {
      cwd: dirname(directory),
    },
  );

  // Weird problem where we are left with a package-lock.json file after installation
  if (monorepoDirectory) {
    await removeFile({
      path: join(monorepoDirectory ?? directory, "package-lock.json"),
    });
  }

  await writePackage({ directory, data: oldPackage });
}

// @todo repo not supported atm, because we'd need to restore yarn and git state
export const cra = {
  type: PluginType.Workspace,
  apply,
};
