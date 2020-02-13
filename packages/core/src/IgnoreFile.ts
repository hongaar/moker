import { TextFile } from './TextFile'

export class IgnoreFile extends TextFile {
  public get contents() {
    return this.text.split('\n')
  }

  public set contents(entries) {
    this.text = entries.join('\n')
  }
}
