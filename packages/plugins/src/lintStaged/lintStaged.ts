import {
  enqueueInstallDependency,
  enqueueRemoveDependency,
  hasPlugin,
  PluginArgs,
  PluginType,
  updatePackage,
  writePackage,
} from "@mokr/core";
import {
  addPreCommitHookCommand,
  removePreCommitHookCommand,
} from "../husky/husky.js";

const PRE_COMMIT_HOOK_COMMAND = "yarn lint-staged";

async function install({ directory }: PluginArgs) {
  enqueueInstallDependency({
    directory,
    identifier: "lint-staged",
    dev: true,
  });
}

async function remove({ directory }: PluginArgs) {
  enqueueRemoveDependency({ directory, identifier: "lint-staged" });

  // Remove prettier integration
  await updatePackage({
    directory,
    merge: (existingData) => {
      delete existingData?.["lint-staged"];
      return existingData;
    },
  });

  // Remove husky integration
  removePreCommitHookCommand({ directory, command: PRE_COMMIT_HOOK_COMMAND });
}

async function load({ directory }: PluginArgs) {
  if (await hasPlugin({ directory, name: "prettier" })) {
    await writePackage({
      directory,
      data: {
        "lint-staged": {
          "*": "prettier --write --ignore-unknown",
        },
      },
    });
  }

  if (await hasPlugin({ directory, name: "husky" })) {
    await addPreCommitHookCommand({
      directory,
      command: PRE_COMMIT_HOOK_COMMAND,
    });
  }
}

export const lintStaged = {
  type: PluginType.Repo,
  install,
  remove,
  load,
};
