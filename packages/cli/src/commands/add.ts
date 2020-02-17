import path from 'path'
import { command } from 'bandersnatch'
import ora from 'ora'
import { Project, Workspace, templates } from '@mokr/core'

export const add = command('add', 'Add a workspace to the project')
  .argument('name', 'Name of the workspace', {
    prompt: true
  })
  .option('template', 'Use workspace template', {
    choices: Object.keys(templates.workspace),
    default: 'lib'
  })
  .action(async ({ name, template }) => {
    const project = Project.find(process.cwd())

    if (!project) {
      throw new Error('Execute this command from within a project')
    }

    const directory = path.join(project.directory, 'packages', name)

    const spinner = ora(`Creating workspace ${name}...`).start()

    await new Workspace(project, directory).create(
      templates.workspace[template as keyof typeof templates.workspace]
    )

    spinner.succeed(`Created workspace ${name}`)
  })
