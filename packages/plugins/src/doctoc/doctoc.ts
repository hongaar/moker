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

const PRE_COMMIT_HOOK_COMMAND = "yarn doctoc";
const PRE_COMMIT_HOOK_COMMAND_FORMAT = "yarn prettier --write README.md";

async function install({ directory }: PluginArgs) {
  enqueueInstallDependency({ directory, identifier: "doctoc", dev: true });

  await writePackage({
    directory,
    data: {
      scripts: {
        doctoc: "doctoc README.md",
      },
    },
  });
}

async function remove({ directory }: PluginArgs) {
  enqueueRemoveDependency({ directory, identifier: "doctoc" });

  await updatePackage({
    directory,
    merge: (existingData) => {
      delete existingData?.["scripts"]?.["doctoc"];
      return existingData;
    },
  });

  // Remove husky integration
  removePreCommitHookCommand({ directory, command: PRE_COMMIT_HOOK_COMMAND });
  removePreCommitHookCommand({
    directory,
    command: PRE_COMMIT_HOOK_COMMAND_FORMAT,
  });
}

async function load({ directory }: PluginArgs) {
  if (await hasPlugin({ directory, name: "husky" })) {
    await addPreCommitHookCommand({
      directory,
      command: PRE_COMMIT_HOOK_COMMAND,
    });

    if (await hasPlugin({ directory, name: "prettier" })) {
      await addPreCommitHookCommand({
        directory,
        command: PRE_COMMIT_HOOK_COMMAND_FORMAT,
      });
    }
  }
}

export const doctoc = {
  type: PluginType.Monorepo,
  install,
  remove,
  load,
};
