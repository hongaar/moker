import { IgnoreFile } from './IgnoreFile'

export class GitIgnore extends IgnoreFile {
  constructor(public directory: string) {
    super(directory, '.gitignore')
  }
}
