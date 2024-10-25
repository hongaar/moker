import {
  PluginType,
  emptyDirectory,
  exec,
  readPackage,
  removeFile,
  writePackage,
  type TemplateArgs,
} from "@mokr/core";
import { join } from "path";

async function apply({ directory }: TemplateArgs) {
  const oldPackage = await readPackage({ directory });

  await emptyDirectory({ directory });

  await exec(
    "yarn",
    ["dlx", "degit", "https://github.com/nestjs/typescript-starter"],
    {
      cwd: directory,
    },
  );

  await removeFile({ path: join(directory, "package-lock.json") });

  delete oldPackage.scripts?.["build"];
  delete oldPackage.scripts?.["test"];

  await writePackage({ directory, data: oldPackage });
}

// @todo repo not supported atm, because we'd need to restore yarn and git state
export const nestjs = {
  type: PluginType.Workspace,
  apply,
};
