import { ScriptTarget, ModuleKind } from 'typescript'
import { Package } from '..'

export async function typescript(pkg: Package) {
  if (pkg.isProject()) {
    pkg.tsconfigJson.contents.compilerOptions = {
      strict: true,
      target: ('ES2015' as unknown) as ScriptTarget,
      module: ('CommonJS' as unknown) as ModuleKind,
      esModuleInterop: true,
      lib: ['ESNext'],
      declaration: true,
      sourceMap: true
    }

    pkg.packageJson.contents.scripts = {
      ...pkg.packageJson.contents.scripts,
      build: 'lerna run build',
      'watch:build': 'lerna run --parallel watch:build'
    }
  } else {
    pkg.tsconfigJson.contents = {
      extends: '../../tsconfig.json',
      compilerOptions: {
        rootDir: 'src',
        outDir: 'lib'
      }
    }

    pkg.packageJson.contents.scripts = {
      ...pkg.packageJson.contents.scripts,
      prepublishOnly: 'yarn build',
      build: 'tsc',
      'watch:build': 'tsc --watch'
    }

    pkg.addDevDependency('typescript')
  }
}
