import path from 'path'
import { command } from 'bandersnatch'
import ora from 'ora'
import { Project, templates } from '@mokr/core'

export const create = command('create', 'Create a new project')
  .argument('name', 'Name of the project', {
    prompt: true
  })
  .option('template', 'Use project template', {
    choices: Object.keys(templates.project),
    default: 'typescript'
  })
  .option('license', 'License to use', {
    choices: ['MIT', 'GPLv3'],
    default: 'MIT'
  })
  .action(async ({ name, template, license }) => {
    const directory = path.join(process.cwd(), name)

    const spinner = ora(`Creating project ${name}...`).start()

    await new Project(directory).create(templates.project[template], {
      license
    })

    spinner.succeed(`Created project ${name}`)
  })
