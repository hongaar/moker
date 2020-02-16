import { Project } from '..'

type LernaOptions = {
  version?: string
  workspaces?: string[]
}

export async function lerna(project: Project, options: LernaOptions = {}) {
  project.lernaJson.contents = {
    version: options.version,
    packages: options.workspaces,
    npmClient: 'yarn',
    useWorkspaces: true
  }

  project.addDevDependency('lerna')
}
