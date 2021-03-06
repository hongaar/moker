import { join, dirname } from 'path'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import { sync as mkdirp } from 'mkdirp'

export class TextFile {
  constructor(public directory: string, public filename: string) {
    this.createIfNeeded()
  }

  public get path() {
    return join(this.directory, this.filename)
  }

  public get exists() {
    return existsSync(this.path)
  }

  public get text() {
    return this.exists ? readFileSync(this.path, 'utf8').trim() : null
  }

  public set text(contents: string | null) {
    writeFileSync(this.path, (contents ?? '').trim() + '\n')
  }

  private createIfNeeded() {
    if (!this.exists) {
      mkdirp(dirname(this.path))
    }
  }
}
