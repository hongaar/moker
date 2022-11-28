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

const PRE_COMMIT_HOOK_COMMAND = "yarn todos && git add TODO.md";
const PRE_COMMIT_HOOK_COMMAND_FORMAT =
  "yarn prettier --write TODO.md && git add TODO.md";

async function install({ directory }: PluginArgs) {
  enqueueInstallDependency({ directory, identifier: "leasot", dev: true });

  await writePackage({
    directory,
    data: {
      scripts: {
        todos:
          'leasot --exit-nicely --reporter markdown --ignore "**/node_modules" "**/*.ts" > TODO.md',
      },
    },
  });
}

async function remove({ directory }: PluginArgs) {
  enqueueRemoveDependency({ directory, identifier: "leasot" });

  await updatePackage({
    directory,
    merge: (existingData) => {
      delete existingData?.["scripts"]?.["todos"];
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

export const todos = {
  type: PluginType.Repo,
  install,
  remove,
  load,
};
