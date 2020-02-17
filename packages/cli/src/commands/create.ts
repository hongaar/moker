import path from 'path'
import { command } from 'bandersnatch'
import ora from 'ora'
import {
  Project,
  templates,
  DEFAULT_INITIAL_VERSION,
  DEFAULT_WORKSPACES_DIRECTORY
} from '@mokr/core'

export const create = command('create', 'Create a new project')
  .argument('name', 'Project name', {
    prompt: 'What is the name of your project?'
  })
  .option('template', 'Kick-start with this template', {
    choices: Object.keys(templates.project),
    default: 'typescript'
  })
  .option('scoped', 'Use scoped packages', {
    boolean: true,
    prompt: 'Do you want to use scoped package names?',
    default: false
  })
  .option('license', 'License', {
    choices: ['MIT', 'GPLv3'],
    prompt: 'What license do you want to publish your packages with?',
    default: 'MIT'
  })
  .option('initialVersion', 'Initial version', {
    prompt: 'What version do you want to start with?',
    default: DEFAULT_INITIAL_VERSION
  })
  .option('workspacesDirectory', 'Workspaces directory', {
    prompt: 'Which directory should we save workspaces to?',
    default: DEFAULT_WORKSPACES_DIRECTORY
  })
  .action(async ({ name, template, ...rest }) => {
    const directory = path.join(process.cwd(), name)

    const spinner = ora(`Creating project ${name}...`).start()

    await new Project(directory).create(
      templates.project[template as keyof typeof templates.project],
      rest
    )

    spinner.succeed(`Created project ${name}`)
  })
