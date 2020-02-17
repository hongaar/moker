import { ScriptTarget, ModuleKind } from 'typescript'
import { Package } from '..'

export async function typescript(pack: Package) {
  if (pack.isRoot()) {
    pack.tsconfigJson.contents.compilerOptions = {
      strict: true,
      target: ('ES2015' as unknown) as ScriptTarget,
      module: ('CommonJS' as unknown) as ModuleKind,
      esModuleInterop: true,
      lib: ['ESNext'],
      declaration: true,
      sourceMap: true
    }

    pack.packageJson.contents.scripts = {
      ...pack.packageJson.contents.scripts,
      build: 'lerna run build',
      'watch:build': 'lerna run --parallel watch:build'
    }
  } else {
    pack.tsconfigJson.contents = {
      extends: '../../tsconfig.json',
      compilerOptions: {
        rootDir: 'src',
        outDir: 'lib'
      }
    }

    pack.packageJson.contents.scripts = {
      ...pack.packageJson.contents.scripts,
      prepublishOnly: 'yarn build',
      build: 'tsc',
      'watch:build': 'tsc --watch'
    }

    pack.addDevDependency('typescript')
  }
}
