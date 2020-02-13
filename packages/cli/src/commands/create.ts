import path from 'path'
import { command } from 'bandersnatch'
import { Workspace, assertYarnIsAvailable } from '@moker/core'
import { tsWorkspace } from '@moker/template-common'

export const init = command('create', 'Create a new workspace')
  .argument('name', 'Name of the workspace', {
    prompt: true
  })
  .option('license', 'License to use', {
    choices: ['MIT', 'GPLv3'],
    prompt: true
  })
  .action(({ name, license }) => {
    assertYarnIsAvailable()

    const directory = path.join(process.cwd(), name)

    new Workspace(directory).create(tsWorkspace, {
      license
    })

    console.log(`Created new workspace ${name}`)
  })
