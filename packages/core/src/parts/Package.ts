import path from 'path'
import { asyncForEach, exec } from '../utils'
import { GitIgnore } from './GitIgnore'
import { PackageJson } from './PackageJson'
import { TsconfigJson } from './TsconfigJson'

type AddDependencyQueue = {
  dependencies: string[]
  devDependencies: string[]
}

export class Package {
  private addDependencyQueue: AddDependencyQueue = {
    dependencies: [],
    devDependencies: []
  }

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

  public installQueue() {
    return asyncForEach(
      Object.keys(this.addDependencyQueue),
      async (queue: keyof AddDependencyQueue) => {
        if (!this.addDependencyQueue[queue].length) {
          return
        }

        const packages = this.addDependencyQueue[queue]
        const flags = []
        if (queue === 'devDependencies') {
          flags.push('--dev')
        }
        if (this.packageJson.contents.workspaces) {
          flags.push('--ignore-workspace-root-check')
        }

        //console.log('executing yarn with', { packages, flags })

        await exec('yarn', ['add', ...packages, ...flags], {
          cwd: this.directory
        })

        this.addDependencyQueue[queue] = []
      }
    )
  }

  public addDependency(name: string) {
    this.addDependencyQueue.dependencies.push(name)
  }

  public addDevDependency(name: string) {
    this.addDependencyQueue.devDependencies.push(name)
  }
}
