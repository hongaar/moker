import fs from 'fs'
import path from 'path'
import { sync as pkgUp } from 'pkg-up'
import { Package } from './Package'
import { LernaJson } from './LernaJson'

export type CreateProjectOptions = {
  license?: string
}

type ProjectTemplate = (project: Project, options: CreateProjectOptions) => void

export class Project extends Package {
  public get lernaJson() {
    return new LernaJson(this.directory)
  }

  public static find(directory: string) {
    const root = pkgUp({ cwd: directory })

    if (root !== null) {
      return new Project(path.dirname(root))
    }
  }

  public create(
    templateFn: ProjectTemplate,
    options: CreateProjectOptions = {}
  ) {
    if (fs.existsSync(this.directory)) {
      throw new Error(`${this.directory} already exists`)
    }

    fs.mkdirSync(this.directory)

    templateFn(this, options)
  }
}
