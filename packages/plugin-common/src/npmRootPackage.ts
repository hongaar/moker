import { PackageJsonSchema, Project } from '@moker/core'

export function npmRootPackage(
  project: Project,
  extraContents: Partial<PackageJsonSchema>
) {
  project.gitignore.contents = ['node_modules/']

  project.packageJson.contents = {
    name: project.name,
    version: '0.0.1',
    private: true,
    workspaces: ['packages/*'],
    ...extraContents
  }

  project.lernaJson.contents = {
    npmClient: 'yarn',
    useWorkspaces: true
  }

  project.packageJson.addRootDevDependency('lerna')
}
