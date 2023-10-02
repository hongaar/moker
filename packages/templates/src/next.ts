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
      "create-next-app",
      basename(directory),
      "--app",
      "--typescript",
      "--eslint",
      "--no-tailwind",
      "--src-dir",
      '--import-alias "@/*"',
      "--use-yarn",
    ],
    {
      cwd: dirname(directory),
    },
  );

  await writePackage({ directory, data: oldPackage });
}

export const next = {
  type: PluginType.RepoOrWorkspace,
  apply,
};
