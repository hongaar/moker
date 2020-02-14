import { TextFile, Package } from '..'

export function readme(pack: Package) {
  new TextFile(pack.directory, 'README.md').text = `# ${pack.name}`
}
