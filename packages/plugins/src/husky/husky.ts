import {
  enqueueRemoveDependency,
  exec,
  installDependency,
  logWarning,
  PluginArgs,
  PluginType,
  removeDirectory,
  updatePackage,
  writePackage,
} from "@mokr/core";
import { join } from "node:path";

async function install({ directory }: PluginArgs) {
  // Don't enqueue because we need it immediately
  await installDependency({ directory, identifier: "husky", dev: true });
  await exec("yarn", ["husky", "install"], { cwd: directory });
  await writePackage({
    directory,
    data: {
      scripts: {
        postinstall: "husky install",
      },
    },
  });
}

async function remove({ directory }: PluginArgs) {
  await enqueueRemoveDependency({ directory, identifier: "husky" });
  await updatePackage({
    directory,
    merge: (existingData) => {
      if (existingData.scripts?.["postinstall"] !== "husky install") {
        logWarning(
          "Can't automatically remove 'husky install' from package.json, please manually review the 'postinstall' script."
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
  type: PluginType.Monorepo,
  install,
  remove,
  load,
};
