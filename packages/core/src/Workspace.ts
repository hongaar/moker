import fs from 'fs'
import { Project } from './Project'
import { Package } from './Package'

export type CreateWorkspaceOptions = {
  license?: string
}

type WorkspaceTemplate = (
  workspace: Workspace,
  options: CreateWorkspaceOptions
) => void

export class Workspace extends Package {
  constructor(public project: Project, public directory: string) {
    super(directory)
  }

  public create(
    templateFn: WorkspaceTemplate,
    options: CreateWorkspaceOptions = {}
  ) {
    if (fs.existsSync(this.directory)) {
      throw new Error(`${this.directory} already exists`)
    }

    fs.mkdirSync(this.directory, { recursive: true })

    templateFn(this, options)
  }
}
