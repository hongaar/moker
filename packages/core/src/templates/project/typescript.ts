import { plugins, Project, CreateProjectOptions } from '../..'

export async function typescript(
  project: Project,
  {
    scoped,
    license,
    initialVersion: version,
    workspacesDirectory
  }: CreateProjectOptions
) {
  const workspaces = [`${workspacesDirectory}/*`]

  await plugins.npmPackage(project, {
    name: project.name,
    version,
    workspaces,
    license,
    mokr: {
      scoped
    }
  })
  await plugins.lerna(project, {
    version,
    workspaces
  })
  await plugins.typescript(project)
  await plugins.readme(project)
  await plugins.gitignore(project)
  await plugins.jest(project)

  await project.installQueue()
}
