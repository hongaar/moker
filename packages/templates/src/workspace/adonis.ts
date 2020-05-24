import path from 'path'
import { Plugins, Workspace, CreateWorkspaceOptions, exec } from '@mokr/core'

export async function adonis(
  workspace: Workspace,
  options: CreateWorkspaceOptions,
  plugins: Plugins
) {
  const name = path.basename(workspace.directory) // workspace.name may be scoped
  await exec(
    'yarn',
    [
      'create',
      'adonis-ts-app',
      name,
      '--boilerplate',
      'api',
      '--name',
      name,
      '--no-eslint',
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
  await plugins.readme(workspace)

  /**
   * @todo
   * yarn hoists the adonis-preset-ts package
   * error: tsconfig.json:9:14 - error TS6053: File './node_modules/adonis-preset-ts/tsconfig' not found.
   * work around by updating tsconfig in workspace:
   * "extends": "../../node_modules/adonis-preset-ts/tsconfig",
   */
}
