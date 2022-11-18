import { Package, PackageJsonSchema } from "../index.js";

export async function npmPackage(
  pkg: Package,
  contents: Partial<PackageJsonSchema>
) {
  if (pkg.isMonorepo()) {
    pkg.packageJson.assign({
      private: true,
      scripts: {
        publish: "lerna publish",
        start: "lerna run --parallel start",
      },
      ...contents,
    });
  } else if (pkg.isWorkspace()) {
    pkg.packageJson.assign({
      ...contents,
    });

    if (pkg.monorepo.scoped) {
      pkg.packageJson.contents.publishConfig = {
        access: "public",
      };
    }

    pkg.addDevDependency("@types/node");
  }
}
