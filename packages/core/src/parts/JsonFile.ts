import merge from 'deepmerge'
import { TextFile } from './TextFile'

function schemaProxy<Schema extends object>(
  object: Schema,
  onChange: (object: Schema) => void
) {
  // Create a new Proxy so that all property writes are immediately saved through
  // the onChange callback
  return new Proxy(object, {
    set: function (target, prop, value) {
      const result = Reflect.set(target, prop, value)
      onChange(target)
      return result
    },
  })
}

export class JsonFile<Schema extends object> extends TextFile {
  constructor(
    public directory: string,
    public filename: string,
    public SchemaClass: { new (object: Schema): Schema }
  ) {
    super(directory, filename)
  }

  public get contents() {
    const object = new this.SchemaClass(JSON.parse(this.text || '{}'))
    return schemaProxy(object, (object) => (this.contents = object))
  }

  public set contents(object: Schema) {
    this.text = JSON.stringify(object, undefined, 2)
  }

  public assign(object: Partial<Schema>) {
    const base = this.contents
    this.contents = merge(base, object)
  }
}
