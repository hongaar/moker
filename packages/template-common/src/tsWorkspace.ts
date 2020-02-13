import { Workspace, CreateWorkspaceOptions } from '@moker/core'
import { npmPackage, readme, typescript } from '@moker/plugin-common'

export function tsWorkspace(
  workspace: Workspace,
  options: CreateWorkspaceOptions
) {
  npmPackage(workspace, options)
  typescript(workspace)
  readme(workspace)
}
