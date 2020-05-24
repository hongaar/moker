import { TextFile, Package } from '..'

export async function file(pkg: Package, filename: string, contents: string) {
  new TextFile(pkg.directory, filename).text = contents
}
