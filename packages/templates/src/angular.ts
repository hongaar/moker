import {
  PluginType,
  exec,
  readPackage,
  removeDirectory,
  writePackage,
  type TemplateArgs,
} from "@mokr/core";
import { basename, dirname } from "node:path";

async function apply({ directory }: TemplateArgs) {
  const oldPackage = await readPackage({ directory });

  await removeDirectory({ directory });

  await exec(
    "yarn",
    [
      "dlx",
      "@angular/cli",
      "new",
      "--package-manager",
      "yarn",
      "--force",
      "--skip-git",
      "--skip-install",
      basename(directory),
    ],
    {
      cwd: dirname(directory),
      io: "passthrough",
    },
  );

  delete oldPackage.scripts?.["build"];
  delete oldPackage.scripts?.["test"];

  await writePackage({ directory, data: oldPackage });
}

export const angular = {
  type: PluginType.RepoOrWorkspace,
  apply,
};
