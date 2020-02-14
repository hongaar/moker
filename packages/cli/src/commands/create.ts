import path from 'path'
import { command } from 'bandersnatch'
import { Project } from '@moker/core'
import { project as templates } from '@moker/template-common'

export const create = command('create', 'Create a new project')
  .argument('name', 'Name of the project', {
    prompt: true
  })
  .option('template', 'Use project template', {
    choices: Object.keys(templates),
    default: 'typescript'
  })
  .option('license', 'License to use', {
    choices: ['MIT', 'GPLv3'],
    default: 'MIT'
  })
  .action(({ name, template, license }) => {
    const directory = path.join(process.cwd(), name)

    new Project(directory).create(templates[template], {
      license
    })

    console.log(`Created project ${name}`)
  })
