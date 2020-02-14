import { plugins, Workspace, CreateWorkspaceOptions } from '../..'

export function cra(workspace: Workspace, options: CreateWorkspaceOptions) {
  plugins.npmPackage(workspace, options)
  plugins.typescript(workspace)
  plugins.readme(workspace)
}
