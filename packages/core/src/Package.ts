import path from 'path'
import { GitIgnore } from './GitIgnore'
import { PackageJson } from './PackageJson'
import { TsconfigJson } from './TsconfigJson'

export class Package {
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
}
