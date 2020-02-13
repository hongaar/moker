import { Workspace, CreateWorkspaceOptions } from '@moker/core'

export function npmPackage(
  workspace: Workspace,
  options: CreateWorkspaceOptions
) {
  workspace.gitignore.contents = ['node_modules/']

  workspace.packageJson.contents = {
    name: workspace.name,
    version: '0.0.1',
    private: true,
    license: options.license
  }

  workspace.packageJson.addDependency('wsrun')
}
