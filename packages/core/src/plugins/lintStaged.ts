import { Project } from '..'
import { PackageJsonSchema } from '../parts'

export async function lintStaged(
  project: Project,
  linters: PackageJsonSchema['lint-staged']
) {
  project.packageJson.assign({
    husky: {
      hooks: {
        'pre-commit': 'lint-staged',
      },
    },
    'lint-staged': linters,
  })

  project.addDevDependency('husky lint-staged')
}
