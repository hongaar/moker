import { CreateWorkspaceOptions, exec, Plugins, Workspace } from '@mokr/core'
import path from 'path'

export async function cra(
  workspace: Workspace,
  options: CreateWorkspaceOptions,
  plugins: Plugins
) {
  await exec(
    'yarn',
    [
      'create',
      'react-app',
      path.basename(workspace.directory), // workspace.name may be scoped
      '--template',
      'typescript',
    ],
    {
      cwd: path.dirname(workspace.directory),
    }
  )
  await plugins.npmPackage(workspace, {
    name: workspace.name,
    version: workspace.project.lernaJson.contents.version,
    license: workspace.project.packageJson.contents.license,
  })
}
