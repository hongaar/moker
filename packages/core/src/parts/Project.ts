import fs from 'fs'
import path from 'path'
import { sync as pkgUp } from 'pkg-up'
import { Plugins, plugins } from '..'
import { Package } from './Package'
import { LernaJson } from './LernaJson'

export const DEFAULT_LICENSE = 'MIT'
export const DEFAULT_INITIAL_VERSION = '0.0.0'
export const DEFAULT_WORKSPACES_DIRECTORY = 'packages'

const defaultOptions = {
  scoped: false,
  license: DEFAULT_LICENSE,
  initialVersion: DEFAULT_INITIAL_VERSION,
  workspacesDirectory: DEFAULT_WORKSPACES_DIRECTORY
}

export type CreateProjectOptions = {
  scoped: boolean
  license: string
  initialVersion: string
  workspacesDirectory: string
}

type ProjectTemplate = (
  project: Project,
  options: CreateProjectOptions,
  plugins: Plugins
) => Promise<void>

export class Project extends Package {
  public static find(directory: string): undefined | Project {
    const root = pkgUp({ cwd: directory })

    if (root !== null) {
      const pkg = new Package(path.dirname(root))

      if (!pkg.isRoot()) {
        // Not a root project, proceed to parent directory
        return Project.find(path.dirname(path.dirname(root)))
      }

      return new Project(path.dirname(root))
    }
  }

  public get scoped() {
    return !!this.packageJson.contents.mokr?.scoped
  }

  public get lernaJson() {
    return new LernaJson(this.directory)
  }

  public async create(
    templateFn: ProjectTemplate,
    options: Partial<CreateProjectOptions> = {}
  ) {
    if (fs.existsSync(this.directory)) {
      throw new Error(`${this.directory} already exists`)
    }

    fs.mkdirSync(this.directory)

    const optionsWithDefaults = Object.assign({}, defaultOptions, options)

    await templateFn(this, optionsWithDefaults, plugins)
  }
}
