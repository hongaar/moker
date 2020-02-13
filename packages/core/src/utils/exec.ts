import { spawnSync } from 'child_process'

type Options = {
  cwd?: string
  env?: {}
  io?: 'return' | 'passthrough'
}

export function exec(cmd: string, args = [], { cwd, env, io }: Options = {}) {
  const process = spawnSync(cmd, args, {
    shell: true,
    encoding: 'utf8',
    stdio: io === 'passthrough' ? 'inherit' : 'pipe',
    cwd,
    env
  })

  if (process.status !== 0) {
    const error = new Error(`exec [${cmd}] returned with an error`)
    Object.assign(error, process)

    throw error
  }

  return process
}
