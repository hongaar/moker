import { CompilerOptions } from 'typescript'
import { JsonFile } from './JsonFile'

class TsconfigJsonSchema {
  files?: string[]
  include?: string[]
  exclude?: string[]
  extends?: string
  // references
  // typeAcquisition
  compilerOptions?: CompilerOptions

  constructor(object: TsconfigJsonSchema) {
    Object.assign(this, object)
  }
}

export class TsconfigJson extends JsonFile<TsconfigJsonSchema> {
  constructor(public directory: string) {
    super(directory, 'tsconfig.json', TsconfigJsonSchema)
  }
}
