import path from 'path'
import { command } from 'bandersnatch'
import { Project, Workspace } from '@moker/core'
import { workspace as templates } from '@moker/template-common'

export const add = command('add', 'Add a workspace to the project')
  .argument('name', 'Name of the workspace', {
    prompt: true
  })
  .option('template', 'Use workspace template', {
    choices: Object.keys(templates),
    default: 'lib'
  })
  .action(({ name, template }) => {
    const project = Project.find(process.cwd())

    if (!project) {
      throw new Error('Execute this command from within a project')
    }

    const directory = path.join(project.directory, 'packages', name)

    new Workspace(project, directory).create(templates[template])

    console.log(`Created workspace ${name}`)
  })
