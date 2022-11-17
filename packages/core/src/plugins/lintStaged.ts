import { Monorepo } from "../index.js";
import { PackageJsonSchema } from "../parts/index.js";

export async function lintStaged(
  monorepo: Monorepo,
  linters: PackageJsonSchema["lint-staged"]
) {
  monorepo.packageJson.assign({
    husky: {
      hooks: {
        "pre-commit": "lint-staged",
      },
    },
    "lint-staged": linters,
  });

  monorepo.addDevDependency("husky lint-staged");
}
