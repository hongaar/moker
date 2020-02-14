import { PackageJsonSchema, Project } from '..'

export async function npmRootPackage(
  project: Project,
  extraContents: Partial<PackageJsonSchema>
) {
  project.gitignore.contents = ['node_modules/']

  project.packageJson.contents = {
    private: true,
    ...extraContents
  }

  project.lernaJson.contents = {
    version: extraContents.version,
    packages: extraContents.workspaces,
    npmClient: 'yarn',
    useWorkspaces: true
  }

  await project.packageJson.addRootDevDependency('lerna')
}
