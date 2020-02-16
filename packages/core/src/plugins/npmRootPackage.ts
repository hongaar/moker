import { PackageJsonSchema, Project } from '..'

export async function npmRootPackage(
  project: Project,
  extraContents: Partial<PackageJsonSchema>
) {
  project.packageJson.contents = {
    private: true,
    ...extraContents
  }
}
