import { Package, PackageJsonSchema } from '..'

export async function npmPackage(
  pkg: Package,
  contents: Partial<PackageJsonSchema>
) {
  if (pkg.isProject()) {
    pkg.packageJson.contents = {
      private: true,
      scripts: {
        publish: 'lerna publish',
        start: 'lerna run --parallel start',
        dev:
          'stmux -w always -e ERROR -m beep,system -- [ [ "yarn watch:build" .. "yarn watch:test" ] : -s 1/3 -f "yarn start" ]'
      },
      ...contents
    }
  } else if (pkg.isWorkspace()) {
    pkg.packageJson.contents = {
      ...contents
    }

    if (pkg.project.scoped) {
      pkg.packageJson.contents.publishConfig = {
        access: 'public'
      }
    }

    pkg.addDevDependency('@types/node')
  }
}
