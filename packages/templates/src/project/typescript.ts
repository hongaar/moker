import { CreateProjectOptions, Plugins, Project } from '@mokr/core'

export async function typescript(
  project: Project,
  {
    scoped,
    license,
    initialVersion: version,
    workspacesDirectory,
  }: CreateProjectOptions,
  plugins: Plugins
) {
  const workspaces = [`${workspacesDirectory}/*`]

  await plugins.npmPackage(project, {
    name: project.name,
    license,
    workspaces,
    mokr: {
      scoped,
    },
  })
  await plugins.lerna(project, {
    version,
    workspaces,
  })
  await plugins.typescript(project)
  await plugins.readme(project)
  await plugins.gitignore(project)
  await plugins.jest(project)
  await plugins.prettier(project, '*.{ts,tsx}')

  await project.installQueue()
}
