import { Monorepo } from "../index.js";

export async function stmux(monorepo: Monorepo) {
  monorepo.packageJson.assign({
    scripts: {
      dev: 'stmux -w always -e ERROR -m beep,system -- [ [ "yarn watch:build" .. "yarn watch:test" ] : -s 1/3 -f "yarn start" ]',
    },
  });
  monorepo.addDevDependency("stmux");
}
