import {
  PluginType,
  enqueueInstallDependency,
  enqueueRemoveDependency,
  getMonorepoDirectory,
  hasPlugin,
  removeFile,
  warning,
  writeFile,
  writePackage,
  type PluginArgs,
} from "@mokr/core";
import { join } from "path";

const JEST_CONFIG_FILENAME = "jest.config.js";
const TS_JEST_CONFIG = `
/** @type {import("ts-jest").JestConfigWithTsJest} */

export default {
  preset: "ts-jest/presets/default-esm",
  moduleNameMapper: {
    "^(\\\\.{1,2}/.*)\\\\.js$": "$1",
  },
};
`;

async function install({ directory }: PluginArgs) {
  const monorepoDirectory = await getMonorepoDirectory({ directory });

  if (!hasPlugin({ directory, name: "typescript" })) {
    // @todo: install jest without ts-jest
  } else {
    // Install jest with ts-jest
    enqueueInstallDependency({
      directory,
      identifier: ["jest", "ts-jest", "@types/jest"],
      dev: true,
    });

    await writeFile({
      path: join(directory, JEST_CONFIG_FILENAME),
      contents: TS_JEST_CONFIG,
    });
  }

  await writePackage({
    directory,
    data: {
      scripts: {
        test: "jest",
        "test:watch": "jest --watch",
      },
    },
  });

  if (monorepoDirectory) {
    // At monorepo level
    await writePackage({
      directory: monorepoDirectory,
      data: {
        scripts: {
          test: "yarn workspaces foreach --topological --verbose run test",
          "test:watch":
            "yarn workspaces foreach --parallel --interlaced run test:watch",
        },
      },
    });
  }
}

async function remove({ directory }: PluginArgs) {
  enqueueRemoveDependency({ directory, identifier: ["jest", "ts-jest"] });

  try {
    await removeFile({ path: join(directory, JEST_CONFIG_FILENAME) });
  } catch {}

  warning("Please review package.json manually");
}

async function load() {}

export const jest = {
  type: PluginType.RepoOrWorkspace,
  install,
  remove,
  load,
};
