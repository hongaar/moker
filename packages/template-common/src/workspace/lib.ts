import { Workspace, CreateWorkspaceOptions } from '@moker/core'
import * as plugins from '@moker/plugin-common'

export function lib(workspace: Workspace, options: CreateWorkspaceOptions) {
  plugins.npmPackage(workspace, options)
  plugins.typescript(workspace)
  plugins.readme(workspace)
}
