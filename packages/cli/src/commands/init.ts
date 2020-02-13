import { command } from 'bandersnatch'
import * as core from '@moker/core'

// @todo TS2742
export const init = command('init', 'Initialize new repository')
  .argument('name', 'Name of the project', {
    prompt: true
  })
  .option('license', 'License to use', {
    choices: ['MIT', 'GPLv3'],
    prompt: true
  })
  .action(({ name, license }) => {
    core.assertYarnIsAvailable()

    console.log('Creating ' + name + '...')

    core.init(name)
  })
