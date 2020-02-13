import path from 'path'
import fs from 'fs'
import { exec } from './utils'

type Options = {
  cwd?: string
  license?: string
}

export function init(name: string, { cwd, license }: Options = {}) {
  cwd = cwd || process.cwd()

  const target = path.join(cwd, name)

  fs.mkdirSync(target)

  exec('yarn', ['init', '--yes', '--private'], {
    cwd: target,
    io: 'passthrough'
  })

  // @todo set version/license, etc.
}
