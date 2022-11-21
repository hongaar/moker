import {
  enqueueInstallDependency,
  enqueueRemoveDependency,
  exec,
  hasPlugin,
  isReadableAndWritableFile,
  PluginArgs,
  PluginType,
  readFile,
  removeFile,
  updatePackage,
  writeFile,
  writePackage,
} from "@mokr/core";
import os from "node:os";
import { join } from "node:path";

const PRE_COMMIT_HOOK_COMMAND = "yarn lint-staged";
const PRE_COMMIT_HOOK_FILE = ".husky/pre-commit";

async function install({ directory }: PluginArgs) {
  await enqueueInstallDependency({
    directory,
    identifier: "lint-staged",
    dev: true,
  });
}

async function remove({ directory }: PluginArgs) {
  await enqueueRemoveDependency({ directory, identifier: "lint-staged" });

  // Remove prettier integration
  await updatePackage({
    directory,
    merge: (existingData) => {
      delete existingData?.["lint-staged"];
      return existingData;
    },
  });

  // Remove husky integration
  if (await hasPreCommitHookCommand({ directory })) {
    // There doesn't seem to be a way to remove a hook command with husky

    // Remove the command from the pre-commit
    const newCommands = (await getPreCommitHookCommands({ directory })).filter(
      (command) => command !== PRE_COMMIT_HOOK_COMMAND
    );

    if (newCommands.length === 2) {
      /**
       * We're left with only these lines:
       *
       * ```
       * #!/usr/bin/env sh
       * . "$(dirname -- "$0")/_/husky.sh"
       * ```
       */
      return removeFile({ path: getPreCommitHookPath({ directory }) });
    }

    await setPreCommitHookCommands({ directory, commands: newCommands });
  }
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

  if (
    (await hasPlugin({ directory, name: "husky" })) &&
    !(await hasPreCommitHookCommand({ directory }))
  ) {
    await exec(
      "yarn",
      ["husky", "add", PRE_COMMIT_HOOK_FILE, `"${PRE_COMMIT_HOOK_COMMAND}"`],
      {
        cwd: directory,
      }
    );
  }
}

export const lintStaged = {
  type: PluginType.Monorepo,
  install,
  remove,
  load,
};

function getPreCommitHookPath({ directory }: PluginArgs) {
  return join(directory, PRE_COMMIT_HOOK_FILE);
}

async function getPreCommitHookCommands({ directory }: PluginArgs) {
  if (
    !(await isReadableAndWritableFile({
      path: getPreCommitHookPath({ directory }),
    }))
  ) {
    return [];
  }

  return (
    await readFile({
      path: getPreCommitHookPath({ directory }),
    })
  )
    .trim()
    .split(os.EOL)
    .filter((line) => line !== "");
}

async function setPreCommitHookCommands({
  directory,
  commands,
}: {
  directory: string;
  commands: string[];
}) {
  return writeFile({
    path: getPreCommitHookPath({ directory }),
    contents: commands.join(os.EOL),
  });
}

async function hasPreCommitHookCommand({ directory }: PluginArgs) {
  return (await getPreCommitHookCommands({ directory })).includes(
    PRE_COMMIT_HOOK_COMMAND
  );
}
