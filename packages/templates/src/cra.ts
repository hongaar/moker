import {
  exec,
  getMonorepoDirectory,
  readPackage,
  removeFile,
  removePackage,
  TemplateArgs,
  TemplateType,
  writePackage,
} from "@mokr/core";
import { basename, dirname, join } from "node:path";

async function apply({ directory }: TemplateArgs) {
  const monorepoDirectory = await getMonorepoDirectory({ directory });

  if (!monorepoDirectory) {
    throw new Error("Could not find monorepo directory");
  }

  const oldPackage = await readPackage({ directory });

  await removePackage({ directory });

  await removeFile({ path: join(directory, "README.md") });

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
    }
  );

  // Weird problem where we are left with a package-lock.json file after installation
  await removeFile({ path: join(monorepoDirectory, "package-lock.json") });

  await writePackage({ directory, data: oldPackage });
}

export const cra = {
  type: TemplateType.Workspace,
  apply,
};
