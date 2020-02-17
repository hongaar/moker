import { TextFile } from './TextFile'

export class JestConfig extends TextFile {
  constructor(public directory: string) {
    super(directory, 'jest.config.js')
  }
}
