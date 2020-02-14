import { plugins, Project, CreateProjectOptions } from '../..'

export async function typescript(
  project: Project,
  options: CreateProjectOptions
) {
  await plugins.npmRootPackage(project, {
    version: options.initialVersion,
    workspaces: [`${options.workspacesDirectory}/*`],
    license: options.license
  })
  await plugins.typescript(project)
  await plugins.readme(project)
}
