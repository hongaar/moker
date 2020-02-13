import { Workspace, TextFile } from '@moker/core'

export function readme(workspace: Workspace) {
  new TextFile(workspace.directory, 'README.md').text = `# ${workspace.name}`
}
