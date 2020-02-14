import { Project, CreateProjectOptions } from '@moker/core'
import * as plugins from '@moker/plugin-common'

export function typescript(project: Project, options: CreateProjectOptions) {
  plugins.npmRootPackage(project, {
    license: options.license
  })
  plugins.typescript(project)
  plugins.readme(project)
}
