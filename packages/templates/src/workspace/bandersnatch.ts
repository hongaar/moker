import { Plugins, Workspace, CreateWorkspaceOptions } from '@mokr/core'

export async function bandersnatch(
  workspace: Workspace,
  options: CreateWorkspaceOptions,
  plugins: Plugins
) {
  await plugins.npmPackage(workspace, {
    name: workspace.name,
    version: workspace.project.packageJson.contents.version,
    license: workspace.project.packageJson.contents.license,
    bin: `bin/${workspace.directory}.js`, // workspace.name may be scoped
    files: ['lib'],
  })
  await plugins.typescript(workspace)
  await plugins.readme(workspace)
  await plugins.jest(workspace)

  workspace.addDependency('bandersnatch')

  await workspace.installQueue()
}
