import { ScriptTarget, ModuleKind } from 'typescript'
import { Workspace } from '@moker/core'

export function typescript(workspace: Workspace) {
  workspace.tsconfigJson.contents.compilerOptions = {
    target: ('ES2015' as unknown) as ScriptTarget,
    module: ('CommonJS' as unknown) as ModuleKind,
    esModuleInterop: true,
    lib: ['ESNext'],
    declaration: true,
    sourceMap: true
  }
}
