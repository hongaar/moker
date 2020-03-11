import { Project, Workspace } from '../parts'

export async function jest(pkg: Project | Workspace) {
  if (pkg.isProject()) {
    pkg.jestConfig.text = `module.exports = {\n
    preset: 'ts-jest',\n
    testMatch: '**/*.test.(ts|tsx)'\n
  }\n
  `
    pkg.packageJson.contents.scripts = {
      ...pkg.packageJson.contents.scripts,
      test: 'lerna run test',
      'watch:test': 'lerna run --parallel watch:test'
    }
    pkg.addDevDependency('jest ts-jest')
  } else {
    pkg.packageJson.contents.scripts = {
      ...pkg.packageJson.contents.scripts,
      test: 'jest',
      'watch:test': 'jest --watch'
    }
  }
}
