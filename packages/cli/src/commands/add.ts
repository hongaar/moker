import { asyncForEach, Project, Workspace } from '@mokr/core'
import { workspace } from '@mokr/templates'
import { command } from 'bandersnatch'
import ora from 'ora'
import path from 'path'

export const add = command('add', 'Add a workspace to the project')
  .argument('name', 'Name of the workspace', {
    prompt: true,
    variadic: true,
  })
  .option('template', 'Use workspace template', {
    choices: Object.keys(workspace),
    default: 'lib',
  })
  .action(async ({ name, template }) => {
    const project = Project.find(process.cwd())

    if (!project) {
      throw new Error('Execute this command from within a project')
    }

    await asyncForEach(name, async (name) => {
      const directory = path.join(project.directory, 'packages', name)

      const spinner = ora(`Creating workspace ${name}...`).start()

      await new Workspace(project, directory).create(
        workspace[template as keyof typeof workspace]
      )

      spinner.succeed(`Created workspace ${name}`)
    })
  })
