import { JsonFile } from './JsonFile'
import { exec } from './utils'

class PackageJsonSchema {
  // Source: https://gist.github.com/iainreid820/5c1cc527fe6b5b7dba41fec7fe54bf6e
  public name: string
  public version?: string
  public description?: string
  public keywords?: string[]
  public homepage?: string
  public bugs?: string | Bugs
  public license?: string
  public author?: string | Author
  public contributors?: string[] | Author[]
  public files?: string[]
  public main?: string
  public bin?: string | BinMap
  public man?: string | string[]
  public directories?: Directories
  public repository?: string | Repository
  public scripts?: ScriptsMap
  public config?: Config
  public dependencies?: DependencyMap
  public devDependencies?: DependencyMap
  public peerDependencies?: DependencyMap
  public optionalDependencies?: DependencyMap
  public bundledDependencies?: string[]
  public engines?: Engines
  public os?: string[]
  public cpu?: string[]
  public preferGlobal?: boolean
  public private?: boolean
  public publishConfig?: PublishConfig

  constructor(object: PackageJsonSchema) {
    Object.assign(this, object)
  }
}

interface Author {
  name: string
  email?: string
  homepage?: string
}

interface BinMap {
  [commandName: string]: string
}

interface Bugs {
  email: string
  url: string
}

interface Config {
  name?: string
  config?: Object
}

interface DependencyMap {
  [dependencyName: string]: string
}

interface Directories {
  lib?: string
  bin?: string
  man?: string
  doc?: string
  example?: string
}

interface Engines {
  node?: string
  npm?: string
}

interface PublishConfig {
  registry?: string
}

interface Repository {
  type: string
  url: string
}

interface ScriptsMap {
  [scriptName: string]: string
}

export class PackageJson extends JsonFile<PackageJsonSchema> {
  constructor(public directory: string) {
    super(directory, 'package.json', PackageJsonSchema)
  }

  public addDependency(name: string, dev = false) {
    return exec('yarn', ['add', name, dev ? '--dev' : ''], {
      cwd: this.directory
    })
  }

  public addDevDependency(name: string) {
    return this.addDependency(name, true)
  }
}
