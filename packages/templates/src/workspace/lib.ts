import { Plugins, Workspace, CreateWorkspaceOptions } from '@mokr/core'

export async function lib(
  workspace: Workspace,
  options: CreateWorkspaceOptions,
  plugins: Plugins
) {
  await plugins.npmPackage(workspace, {
    name: workspace.name,
    version: workspace.project.packageJson.contents.version,
    license: workspace.project.packageJson.contents.license,
    main: 'lib/index.js',
    files: ['lib']
  })
  await plugins.typescript(workspace)
  await plugins.readme(workspace)
  await plugins.jest(workspace)

  await workspace.installQueue()
}
