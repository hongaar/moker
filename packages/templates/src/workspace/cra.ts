import path from 'path'
import { Plugins, Workspace, CreateWorkspaceOptions, exec } from '@mokr/core'

export async function cra(
  workspace: Workspace,
  options: CreateWorkspaceOptions,
  plugins: Plugins
) {
  await exec(
    'yarn',
    ['create', 'react-app', workspace.name, '--template', 'typescript'],
    {
      cwd: path.dirname(workspace.directory)
    }
  )
  // await plugins.npmPackage(workspace, options)
  //await plugins.typescript(workspace)
  //await plugins.readme(workspace)
}
