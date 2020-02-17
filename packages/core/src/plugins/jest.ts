import { Project, Workspace } from '../parts'

export async function jest(pack: Project | Workspace) {
  if (pack.isRoot()) {
    pack.jestConfig.text = `module.exports = {\n
    preset: 'ts-jest',\n
    testMatch: '**/*.test.(ts|tsx)'\n
  }\n
  `
    pack.packageJson.contents.scripts = {
      ...pack.packageJson.contents.scripts,
      test: 'lerna run test',
      'watch:test': 'lerna run --parallel watch:test'
    }
    pack.addDevDependency('jest ts-jest')
  } else {
    pack.packageJson.contents.scripts = {
      ...pack.packageJson.contents.scripts,
      test: 'jest',
      'watch:test': 'jest --watch'
    }
  }
}
