import { CreateWorkspaceOptions, exec, Plugins, Workspace } from "@mokr/core";
import path from "path";

export async function adonis(
  workspace: Workspace,
  options: CreateWorkspaceOptions,
  plugins: Plugins
) {
  const name = path.basename(workspace.directory); // workspace.name may be scoped
  await exec(
    "yarn",
    [
      "create",
      "adonis-ts-app",
      name,
      "--boilerplate",
      "api",
      "--name",
      name,
      "--no-eslint",
    ],
    {
      cwd: path.dirname(workspace.directory),
    }
  );
  await plugins.npmPackage(workspace, {
    name: workspace.name,
    version: workspace.monorepo.lernaJson.contents.version,
    license: workspace.monorepo.packageJson.contents.license,
  });
  await plugins.readme(workspace);

  /**
   * @todo
   * yarn hoists the adonis-preset-ts package
   * error: tsconfig.json:9:14 - error TS6053: File './node_modules/adonis-preset-ts/tsconfig' not found.
   * work around by updating tsconfig in workspace:
   * "extends": "../../node_modules/adonis-preset-ts/tsconfig",
   */
}
