import { Project } from '..'

export async function stmux(project: Project) {
  project.packageJson.assign({
    scripts: {
      dev:
        'stmux -w always -e ERROR -m beep,system -- [ [ "yarn watch:build" .. "yarn watch:test" ] : -s 1/3 -f "yarn start" ]',
    },
  })
  project.addDevDependency('stmux')
}
