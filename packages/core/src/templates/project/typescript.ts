import { plugins, Project, CreateProjectOptions } from '../..'

export async function typescript(
  project: Project,
  options: CreateProjectOptions
) {
  const version = options.initialVersion
  const workspaces = [`${options.workspacesDirectory}/*`]
  const license = options.license

  await plugins.npmRootPackage(project, {
    version,
    workspaces,
    license
  })
  await plugins.lerna(project, {
    version,
    workspaces
  })
  await plugins.typescript(project)
  await plugins.readme(project)
  await plugins.gitignore(project)

  await project.installQueue()
}
