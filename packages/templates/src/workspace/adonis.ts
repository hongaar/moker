import path from 'path'
import { Plugins, Workspace, CreateWorkspaceOptions, exec } from '@mokr/core'

export async function adonis(
  workspace: Workspace,
  options: CreateWorkspaceOptions,
  plugins: Plugins
) {
  await exec(
    'yarn',
    [
      'create',
      'adonis-ts-app',
      path.basename(workspace.directory), // workspace.name may be scoped
    ],
    {
      cwd: path.dirname(workspace.directory),
    }
  )
  await plugins.npmPackage(workspace, {
    name: workspace.name,
    version: workspace.project.packageJson.contents.version,
    license: workspace.project.packageJson.contents.license,
  })
}
