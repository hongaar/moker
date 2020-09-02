import { assertYarnIsAvailable } from '@mokr/core'
import { program } from 'bandersnatch'
import * as commands from './commands'

const mokr = program().prompt('mokr > ')

// @ts-ignore
Object.values(commands).forEach((command) => mokr.add(command))

// Some assertions we always need
assertYarnIsAvailable()

export default mokr
