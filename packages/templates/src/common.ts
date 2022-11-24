import { installPlugin, TemplateArgs, TemplateType } from "@mokr/core";

async function apply({ directory }: TemplateArgs) {
  await installPlugin({ directory, name: "prettier" });
  await installPlugin({ directory, name: "husky" });
  await installPlugin({ directory, name: "lint-staged" });
  await installPlugin({ directory, name: "github-actions" });
  await installPlugin({ directory, name: "semantic-release" });
  await installPlugin({ directory, name: "devcontainer" });
}

export const common = {
  type: TemplateType.Monorepo,
  apply,
};
