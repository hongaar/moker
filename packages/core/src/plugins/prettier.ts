import { plugins, Project } from '..'

export async function prettier(project: Project, lintStaged?: string) {
  project.prettierRcJson.contents = {
    semi: false,
    singleQuote: true,
  }

  if (lintStaged) {
    await plugins.lintStaged(project, {
      [lintStaged]: 'prettier --write',
    })
  }

  project.addDevDependency('prettier')
}
