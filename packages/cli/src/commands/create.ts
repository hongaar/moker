import {
  DEFAULT_INITIAL_VERSION,
  DEFAULT_WORKSPACES_DIRECTORY,
  Project,
} from '@mokr/core'
import { project } from '@mokr/templates'
import { command } from 'bandersnatch'
import ora from 'ora'
import path from 'path'

export const create = command('create')
  .description('Create a new project')
  .argument('name', {
    description: 'Project name',
    prompt: 'What is the name of your project?',
  })
  .option('template', {
    description: 'Kick-start with this template',
    choices: Object.keys(project),
    default: 'typescript',
  })
  .option('scoped', {
    description: 'Use scoped packages',
    boolean: true,
    prompt: 'Do you want to use scoped package names?',
    default: false,
  })
  .option('license', {
    description: 'License',
    choices: ['MIT', 'GPLv3'],
    prompt: 'What license do you want to publish your packages with?',
    default: 'MIT',
  })
  .option('initialVersion', {
    description: 'Initial version',
    prompt: 'What version do you want to start with?',
    default: DEFAULT_INITIAL_VERSION,
  })
  .option('workspacesDirectory', {
    description: 'Workspaces directory',
    prompt: 'Which directory should we save workspaces to?',
    default: DEFAULT_WORKSPACES_DIRECTORY,
  })
  .action(async ({ name, template, ...rest }) => {
    const directory = path.join(process.cwd(), name)

    const spinner = ora(`Creating project ${name}...`).start()

    await new Project(directory).create(
      project[template as keyof typeof project],
      rest
    )

    spinner.succeed(`Created project ${name}`)
  })
