import { installPlugin, PluginType, TemplateArgs } from "@mokr/core";

async function apply({ directory }: TemplateArgs) {
  await installPlugin({ directory, name: "prettier" });

  await installPlugin({ directory, name: "husky" });

  await installPlugin({ directory, name: "lint-staged" });

  await installPlugin({ directory, name: "github-actions" });

  await installPlugin({ directory, name: "semantic-release" });

  await installPlugin({ directory, name: "devcontainer" });

  await installPlugin({ directory, name: "doctoc" });

  await installPlugin({ directory, name: "todos" });
}

export const common = {
  type: PluginType.Repo,
  apply,
};
