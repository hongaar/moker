import {
  PluginType,
  enqueueInstallDependency,
  enqueueRemoveDependency,
  getMonorepoDirectory,
  hasPlugin,
  warning,
  writePackage,
  type PluginArgs,
} from "@mokr/core";

async function install({ directory }: PluginArgs) {
  const monorepoDirectory = await getMonorepoDirectory({ directory });

  if (!hasPlugin({ directory, name: "typescript" })) {
    await writePackage({
      directory,
      data: {
        scripts: {
          test: "node --test",
        },
      },
    });
  } else {
    enqueueInstallDependency({
      directory,
      identifier: "ts-node",
      dev: true,
    });

    await writePackage({
      directory,
      data: {
        scripts: {
          test: "NODE_OPTIONS='--loader=ts-node/esm --no-warnings' node --test test/*.test.ts",
        },
      },
    });
  }

  if (monorepoDirectory) {
    await writePackage({
      directory: monorepoDirectory,
      data: {
        scripts: {
          test: "yarn workspaces foreach --all --topological --verbose run test",
        },
      },
    });
  }
}

async function remove({ directory }: PluginArgs) {
  enqueueRemoveDependency({ directory, identifier: ["ts-node"] });

  warning("Please review package.json manually");
}

async function load() {}

export const test = {
  type: PluginType.RepoOrWorkspace,
  install,
  remove,
  load,
};
