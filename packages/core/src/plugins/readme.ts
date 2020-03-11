import { TextFile, Package } from '..'

export async function readme(pkg: Package) {
  new TextFile(pkg.directory, 'README.md').text = `# ${pkg.name}`
}
