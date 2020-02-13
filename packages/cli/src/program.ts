import { program } from 'bandersnatch'
import * as commands from './commands'

const moker = program().withHelp()

Object.values(commands).forEach(command => moker.add(command))

export default moker
