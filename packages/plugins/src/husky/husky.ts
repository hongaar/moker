import {
  PluginType,
  enqueueRemoveDependency,
  exec,
  installDependency,
  isMonorepo,
  isReadableAndWritableFile,
  readFile,
  removeDirectory,
  removeFile,
  updatePackage,
  warning,
  writeFile,
  writePackage,
  type PluginArgs,
} from "@mokr/core";
import os from "node:os";
import { join } from "node:path";

const PRE_COMMIT_HOOK_FILE = ".husky/pre-commit";

async function install({ directory }: PluginArgs) {
  // Don't enqueue because we need it immediately
  await installDependency({ directory, identifier: "husky", dev: true });

  await exec("yarn", ["husky", "install"], { cwd: directory });

  if (await isMonorepo({ directory })) {
    await writePackage({
      directory,
      data: {
        scripts: {
          postinstall: "husky install",
        },
      },
    });
  }
}

async function remove({ directory }: PluginArgs) {
  enqueueRemoveDependency({ directory, identifier: "husky" });

  await updatePackage({
    directory,
    merge: (existingData) => {
      if (existingData.scripts?.["postinstall"] !== "husky install") {
        warning(
          "Can't automatically remove 'husky install' from package.json, please manually review the 'postinstall' script.",
        );
        return existingData;
      }
      delete existingData.scripts?.["postinstall"];
      return existingData;
    },
  });

  await removeDirectory({ directory: join(directory, ".husky") });

  await exec("git", ["config", "--unset", "core.hooksPath"], {
    cwd: directory,
  });
}

async function load() {}

export const husky = {
  type: PluginType.Repo,
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

async function hasPreCommitHookCommand({
  directory,
  command,
}: PluginArgs & { command: string }) {
  return (await getPreCommitHookCommands({ directory })).includes(command);
}

export async function addPreCommitHookCommand({
  directory,
  command,
}: PluginArgs & { command: string }) {
  if (await hasPreCommitHookCommand({ directory, command })) {
    return;
  }

  await exec("yarn", ["husky", "add", PRE_COMMIT_HOOK_FILE, `"${command}"`], {
    cwd: directory,
  });
}

export async function removePreCommitHookCommand({
  directory,
  command,
}: PluginArgs & { command: string }) {
  if (!(await hasPreCommitHookCommand({ directory, command }))) {
    return;
  }

  // Remove the command from the pre-commit
  const newCommands = (await getPreCommitHookCommands({ directory })).filter(
    (line) => line !== command,
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
    await removeFile({ path: getPreCommitHookPath({ directory }) });
    return;
  }

  await setPreCommitHookCommands({ directory, commands: newCommands });
}
