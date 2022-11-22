import {
  createDirectory,
  installPlugin,
  TemplateArgs,
  TemplateType,
  writeFile,
} from "@mokr/core";
import { join } from "path";

async function apply({ directory }: TemplateArgs) {
  await installPlugin({ directory, name: "typescript" });

  await createDirectory({ directory: join(directory, "src") });

  await writeFile({
    path: join(directory, "src/index.ts"),
    contents: "console.log('Hello, world!')",
  });
}

export const lib = {
  type: TemplateType.Workspace,
  apply,
};
