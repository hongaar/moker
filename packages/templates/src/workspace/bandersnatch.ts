import { CreateWorkspaceOptions, Plugins, Workspace } from '@mokr/core'
import { basename } from 'path'

export async function bandersnatch(
  workspace: Workspace,
  options: CreateWorkspaceOptions,
  plugins: Plugins
) {
  const binPath = `bin/${basename(workspace.directory)}.js` // workspace.name may be scoped
  await plugins.npmPackage(workspace, {
    name: workspace.name,
    version: workspace.project.lernaJson.contents.version,
    license: workspace.project.packageJson.contents.license,
    bin: binPath,
    files: ['lib'],
  })
  await plugins.typescript(workspace)
  await plugins.readme(workspace)
  await plugins.jest(workspace)

  await plugins.file(
    workspace,
    'src/cli.ts',
    `import { program, command } from 'bandersnatch'

export default program()
  .default(
    command('hello')
      .action(() => {
        console.log('Hello, world!')
      })
  )
`
  )
  await plugins.file(
    workspace,
    binPath,
    `#!/usr/bin/env node

require('../lib/cli')
  .default.runOrRepl()
  .catch(console.error)
`
  )

  workspace.addDependency('bandersnatch')

  await workspace.installQueue()
}
