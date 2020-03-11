import path = require('path')
import { asyncForEach, exec } from '../utils'
import { GitIgnore } from './GitIgnore'
import { PackageJson } from './PackageJson'
import { TsconfigJson } from './TsconfigJson'
import { JestConfig } from './JestConfig'
import { Project } from './Project'
import { Workspace } from './Workspace'

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

  public get jestConfig() {
    return new JestConfig(this.directory)
  }

  /**
   * Returns true if the package.json for this package has a workspaces entry.
   */
  public isRoot() {
    return !!this.packageJson.contents.workspaces
  }

  /**
   * Returns true if this package is constructed with the Workspace class.
   */
  public isWorkspace(): this is Workspace {
    return this.constructor.name === 'Workspace'
  }

  /**
   * Returns true if this package is constructed with the Project class.
   */
  public isProject(): this is Project {
    return this.constructor.name === 'Project'
  }

  public installQueue() {
    return asyncForEach(
      Object.keys(this.addDependencyQueue) as Array<keyof AddDependencyQueue>,
      async queue => {
        if (!this.addDependencyQueue[queue].length) {
          return
        }

        const packages = this.addDependencyQueue[queue]
        const flags = ['--exact']
        if (queue === 'devDependencies') {
          flags.push('--dev')
        }
        if (this.isProject()) {
          flags.push('--ignore-workspace-root-check')
        }

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
