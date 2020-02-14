import { program } from 'bandersnatch'
import { assertYarnIsAvailable } from '@moker/core'
import * as commands from './commands'

const moker = program().withHelp()

Object.values(commands).forEach(command => moker.add(command))

// Some assertions we always need
assertYarnIsAvailable()

export default moker
