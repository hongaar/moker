import { plugins, Workspace, CreateWorkspaceOptions } from '../..'
import { project } from '..'

export async function lib(
  workspace: Workspace,
  options: CreateWorkspaceOptions
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
