import { CreateWorkspaceOptions, exec, Plugins, Workspace } from "@mokr/core";
import path from "node:path";

export async function cra(
  workspace: Workspace,
  options: CreateWorkspaceOptions,
  plugins: Plugins
) {
  await exec(
    "yarn",
    [
      "create",
      "react-app",
      path.basename(workspace.directory), // workspace.name may be scoped
      "--template",
      "typescript",
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
}
