import { CreateWorkspaceOptions, Plugins, Workspace } from "@mokr/core";

export async function lib(
  workspace: Workspace,
  options: CreateWorkspaceOptions,
  plugins: Plugins
) {
  await plugins.npmPackage(workspace, {
    name: workspace.name,
    version: workspace.monorepo.lernaJson.contents.version,
    license: workspace.monorepo.packageJson.contents.license,
    main: "lib/index.js",
    files: ["lib"],
  });
  await plugins.typescript(workspace);
  await plugins.readme(workspace);
  await plugins.jest(workspace);

  await plugins.file(
    workspace,
    "src/index.ts",
    "console.log('Hello, world!')\n"
  );

  await workspace.installQueue();
}
