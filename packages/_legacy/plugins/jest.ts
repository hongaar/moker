import { Monorepo, Workspace } from "../parts/index.js";

export async function jest(pkg: Monorepo | Workspace) {
  if (pkg.isMonorepo()) {
    pkg.jestConfig.text = `module.exports = {
  preset: 'ts-jest',
  testRegex: 'test.tsx?$',
}\n`;
    pkg.packageJson.assign({
      scripts: {
        test: "lerna run test",
        "watch:test": "lerna run --parallel watch:test",
      },
    });
    pkg.addDevDependency("jest ts-jest");
  } else {
    pkg.jestConfig.text = `module.exports = require('../../jest.config')\n`;
    pkg.packageJson.assign({
      scripts: {
        test: "jest",
        "watch:test": "jest --watch",
      },
    });
  }
}
