import path from 'path'
import fs from 'fs'
import { ScriptTarget, ModuleKind } from 'typescript'
import { GitIgnore } from './GitIgnore'
import { PackageJson } from './PackageJson'
import { TsconfigJson } from './TsconfigJson'

export type CreateWorkspaceOptions = {
  license?: string
}

type WorkspaceTemplate = (
  workspace: Workspace,
  options: CreateWorkspaceOptions
) => void

export class Workspace {
  constructor(public directory: string) {}

  public get name() {
    return path.basename(this.directory)
  }

  public get gitignore() {
    return new GitIgnore(this.directory)
  }

  public get packageJson() {
    return new PackageJson(this.directory)
  }

  public get tsconfigJson() {
    return new TsconfigJson(this.directory)
  }

  public create(
    templateFn: WorkspaceTemplate,
    options: CreateWorkspaceOptions
  ) {
    if (fs.existsSync(this.directory)) {
      throw new Error(`${this.directory} already exists`)
    }

    fs.mkdirSync(this.directory)

    templateFn(this, options)
  }
}
