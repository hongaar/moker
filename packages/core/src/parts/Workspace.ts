import fs from 'fs'
import { Project } from './Project'
import { Package } from './Package'

export type CreateWorkspaceOptions = {}

type WorkspaceTemplate = (
  workspace: Workspace,
  options: CreateWorkspaceOptions
) => Promise<void>

export class Workspace extends Package {
  constructor(public project: Project, public directory: string) {
    super(directory)
  }

  public async create(
    templateFn: WorkspaceTemplate,
    options: CreateWorkspaceOptions = {}
  ) {
    if (fs.existsSync(this.directory)) {
      throw new Error(`${this.directory} already exists`)
    }

    fs.mkdirSync(this.directory, { recursive: true })

    await templateFn(this, options)
  }
}
