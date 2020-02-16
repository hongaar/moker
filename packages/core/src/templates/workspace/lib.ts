import { plugins, Workspace, CreateWorkspaceOptions } from '../..'

export async function lib(
  workspace: Workspace,
  options: CreateWorkspaceOptions
) {
  await plugins.npmPackage(workspace, options)
  await plugins.typescript(workspace)
  await plugins.readme(workspace)

  await workspace.installQueue()
}
