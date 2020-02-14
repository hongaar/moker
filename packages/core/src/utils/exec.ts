import childProcess, { ChildProcess } from 'child_process'

type Options = {
  cwd?: string
  env?: {}
  io?: 'return' | 'passthrough'
}

function childAwaiter(child: ChildProcess): Promise<number> {
  return new Promise(function(resolve, reject) {
    child.on('error', reject)
    child.on('exit', resolve)
  })
}

export async function exec(
  cmd: string,
  args = [],
  { cwd, env, io }: Options = {}
) {
  const child = childProcess.spawn(cmd, args, {
    shell: true,
    stdio: io === 'passthrough' ? 'inherit' : 'pipe',
    cwd,
    env
  })

  let stdout = ''
  let stderr = ''

  child.stdout.on('data', function(chunk) {
    stdout += chunk
  })

  child.stderr.on('data', function(chunk) {
    stdout += chunk
  })

  const status = await childAwaiter(child)

  const result = { status, stdout, stderr }

  if (status !== 0) {
    const error = new Error(`exec [${cmd}] returned with an error`)
    Object.assign(error, result)

    throw error
  }

  return result
}
