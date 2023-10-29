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
    // @todo: install xv without ts-node
  } else {
    // Install xv with ts-node
    enqueueInstallDependency({
      directory,
      identifier: ["xv", "ts-node"],
      dev: true,
    });
  }

  await writePackage({
    directory,
    data: {
      scripts: {
        test: "xv --loader=ts-node/esm test",
      },
    },
  });

  if (monorepoDirectory) {
    // At monorepo level
    await writePackage({
      directory: monorepoDirectory,
      data: {
        scripts: {
          test: "yarn workspaces foreach --worktree --topological --verbose run test",
        },
      },
    });
  }
}

async function remove({ directory }: PluginArgs) {
  enqueueRemoveDependency({ directory, identifier: ["xv", "ts-node"] });

  warning("Please review package.json manually");
}

async function load() {}

export const xv = {
  type: PluginType.RepoOrWorkspace,
  install,
  remove,
  load,
};
