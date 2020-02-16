import { program } from 'bandersnatch'
import { assertYarnIsAvailable } from '@mokr/core'
import * as commands from './commands'

const mokr = program().withHelp()

Object.values(commands).forEach(command => mokr.add(command))

// Some assertions we always need
assertYarnIsAvailable()

export default mokr
