import { program } from 'bandersnatch'
import * as commands from './commands'

// @todo TS2742
const moker = program().withHelp()

Object.values(commands).forEach(command => moker.add(command))

export default moker
