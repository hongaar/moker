import { Package } from '..'

export async function jest(pack: Package) {
  pack.addDevDependency('jest ts-jest')
}
