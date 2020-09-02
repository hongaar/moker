import { EntriesFile } from './EntriesFile'

export class GitIgnore extends EntriesFile {
  constructor(public directory: string) {
    super(directory, '.gitignore')
  }
}
