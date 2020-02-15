import { ScriptTarget, ModuleKind } from 'typescript'
import { Package } from '..'

export async function typescript(pack: Package) {
  pack.tsconfigJson.contents.compilerOptions = {
    target: ('ES2015' as unknown) as ScriptTarget,
    module: ('CommonJS' as unknown) as ModuleKind,
    esModuleInterop: true,
    lib: ['ESNext'],
    declaration: true,
    sourceMap: true
  }
}
