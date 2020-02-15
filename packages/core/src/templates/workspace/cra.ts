import path from 'path'
import { plugins, Workspace, CreateWorkspaceOptions } from '../..'
import { exec } from '../../utils'

export async function cra(
  workspace: Workspace,
  options: CreateWorkspaceOptions
) {
  await exec(
    'yarn',
    ['create', 'react-app', workspace.name, '--template', 'typescript'],
    {
      cwd: path.dirname(workspace.directory)
    }
  )
  //await plugins.npmPackage(workspace, options)
  //await plugins.typescript(workspace)
  //await plugins.readme(workspace)
}
