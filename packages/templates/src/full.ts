import { installPlugin, TemplateArgs, TemplateType } from "@mokr/core";

async function apply({ directory }: TemplateArgs) {
  await installPlugin({ directory, name: "prettier" });
  await installPlugin({ directory, name: "husky" });
  await installPlugin({ directory, name: "lint-staged" });
  // await installPlugin({ directory, name: "devcontainer" });
  // await installPlugin({ directory, name: "github-actions" });
}

export const full = {
  type: TemplateType.Monorepo,
  apply,
};
