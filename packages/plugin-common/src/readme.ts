import { TextFile, Package } from '@moker/core'

export function readme(pack: Package) {
  new TextFile(pack.directory, 'README.md').text = `# ${pack.name}`
}
