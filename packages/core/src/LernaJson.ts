import { JsonFile } from './JsonFile'

class LernaJsonSchema {
  public lerna?: string
  public packages?: string[]
  public npmClient?: 'npm' | 'yarn'
  public useWorkspaces?: boolean
  public version?: 'fixed' | 'independent'

  constructor(object: LernaJsonSchema) {
    Object.assign(this, object)
  }
}

export class LernaJson extends JsonFile<LernaJsonSchema> {
  constructor(public directory: string) {
    super(directory, 'lerna.json', LernaJsonSchema)
  }
}
