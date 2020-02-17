import { Package, PackageJsonSchema } from '..'

export async function npmPackage(
  pack: Package,
  contents: Partial<PackageJsonSchema>
) {
  if (pack.isRoot()) {
    pack.packageJson.contents = {
      private: true,
      scripts: {
        publish: 'lerna publish',
        start: 'lerna run --parallel start',
        dev:
          'stmux -w always -e ERROR -m beep,system -- [ [ "yarn watch:build" .. "yarn watch:test" ] : -s 1/3 -f "yarn start" ]'
      },
      ...contents
    }
  } else {
    pack.packageJson.contents = {
      ...contents
    }

    if (pack.isRoot() && pack.scoped) {
      pack.packageJson.contents.publishConfig = {
        access: 'public'
      }
    }

    pack.addDevDependency('@types/node')
  }
}
