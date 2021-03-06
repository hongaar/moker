import { Package, PackageJsonSchema } from '..'

export async function npmPackage(
  pkg: Package,
  contents: Partial<PackageJsonSchema>
) {
  if (pkg.isProject()) {
    pkg.packageJson.assign({
      private: true,
      scripts: {
        publish: 'lerna publish',
        start: 'lerna run --parallel start',
      },
      ...contents,
    })
  } else if (pkg.isWorkspace()) {
    pkg.packageJson.assign({
      ...contents,
    })

    if (pkg.project.scoped) {
      pkg.packageJson.contents.publishConfig = {
        access: 'public',
      }
    }

    pkg.addDevDependency('@types/node')
  }
}
