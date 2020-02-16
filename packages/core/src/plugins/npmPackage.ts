import { Package, PackageJsonSchema } from '..'

export async function npmPackage(
  pack: Package,
  extraContents: Partial<PackageJsonSchema>
) {
  pack.packageJson.contents = {
    name: pack.name,
    version: '0.0.1',
    ...extraContents
  }

  pack.addDevDependency('@types/node')
}
