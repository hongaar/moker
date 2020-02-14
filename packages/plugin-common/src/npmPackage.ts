import { Package, PackageJsonSchema } from '@moker/core'

export function npmPackage(
  pack: Package,
  extraContents: Partial<PackageJsonSchema>
) {
  pack.gitignore.contents = ['node_modules/']

  pack.packageJson.contents = {
    name: pack.name,
    version: '0.0.1',
    ...extraContents
  }

  pack.packageJson.addDevDependency('@types/node typescript jest ts-jest')
}
