import path from 'path'
import fs from 'fs'

export class TextFile {
  constructor(public directory: string, public filename: string) {}

  public get path() {
    return path.join(this.directory, this.filename)
  }

  public get exists() {
    return fs.existsSync(this.path)
  }

  public get text() {
    return this.exists ? fs.readFileSync(this.path, 'utf8').trim() : null
  }

  public set text(contents: string) {
    fs.writeFileSync(this.path, contents.trim() + '\n')
  }
}
