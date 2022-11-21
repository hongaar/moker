import { Monorepo, plugins } from "../index.js";

export async function prettier(monorepo: Monorepo, lintStaged?: string) {
  monorepo.prettierRcJson.contents = {
    semi: false,
    singleQuote: true,
  };

  if (lintStaged) {
    await plugins.lintStaged(monorepo, {
      [lintStaged]: "prettier --write",
    });
  }

  monorepo.addDevDependency("prettier");
}
