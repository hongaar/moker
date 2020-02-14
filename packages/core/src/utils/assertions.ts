import { exec } from './exec'

const NEEDS_VERSION = 1

type Unpromise<T extends Promise<any>> = T extends Promise<infer U> ? U : never

export async function assertYarnIsAvailable() {
  let version: Unpromise<ReturnType<typeof exec>>

  try {
    version = await exec('yarn --version')
  } catch (error) {
    throw new Error('Yarn v1 is not installed.')
  }

  if (parseInt(version.stdout, 10) !== NEEDS_VERSION) {
    throw new Error(`Yarn is installed but not in the ^${NEEDS_VERSION} range.`)
  }
}
