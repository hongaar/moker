import {
  exec,
  readPackage,
  removeFile,
  removePackage,
  TemplateArgs,
  TemplateType,
  writePackage,
} from "@mokr/core";
import { basename, dirname, join } from "node:path";

async function apply({ directory }: TemplateArgs) {
  const oldPackage = await readPackage({ directory });

  await removePackage({ directory });

  await removeFile({ path: join(directory, "README.md") });

  await exec(
    "yarn",
    ["create", "react-app", basename(directory), "--template", "typescript"],
    {
      cwd: dirname(directory),
    }
  );

  await writePackage({ directory, data: oldPackage });
}

export const cra = {
  type: TemplateType.Workspace,
  apply,
};
