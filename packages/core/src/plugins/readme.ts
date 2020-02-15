import { TextFile, Package } from '..'

export async function readme(pack: Package) {
  new TextFile(pack.directory, 'README.md').text = `# ${pack.name}`
}
