import { exec } from './exec'

const NEEDS_VERSION = 1

export function assertYarnIsAvailable() {
  let version: ReturnType<typeof exec>

  try {
    version = exec('yarn --version')
  } catch (error) {
    throw new Error('Yarn v1 is not installed.')
  }

  if (parseInt(version.stdout, 10) !== NEEDS_VERSION) {
    throw new Error(`Yarn is installed but not in the ^${NEEDS_VERSION} range.`)
  }
}
