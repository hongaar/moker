import {
  enqueueInstallDependency,
  enqueueRemoveDependency,
  PluginArgs,
  PluginType,
  removeFile,
  updatePackage,
  writeFile,
  writePackage,
} from "@mokr/core";
import os from "node:os";
import { join } from "node:path";
import { removePrettierrc, writePrettierrc } from "./prettierrc.js";

const PRETTIER_IGNORE = [
  "# yarn",
  ".yarn",
  "",
  "# artifacts",
  "lib/",
  "types/",
  "",
];

async function install({ directory }: PluginArgs) {
  await enqueueInstallDependency({
    directory,
    identifier: "prettier",
    dev: true,
  });

  await writePrettierrc({
    directory,
    data: {
      proseWrap: "always",
    },
  });

  await writePackage({
    directory,
    data: {
      scripts: {
        format: "prettier --write --ignore-unknown .",
      },
    },
  });

  await writeFile({
    path: join(directory, ".prettierignore"),
    contents: PRETTIER_IGNORE.join(os.EOL),
  });
}

async function remove({ directory }: PluginArgs) {
  await enqueueRemoveDependency({ directory, identifier: "prettier" });

  await updatePackage({
    directory,
    merge: (existingData) => {
      delete existingData?.["scripts"]?.["format"];
      return existingData;
    },
  });

  await removePrettierrc({
    directory,
  });

  await removeFile({
    path: join(directory, ".prettierignore"),
  });
}

async function load() {}

export const prettier = {
  type: PluginType.Monorepo,
  install,
  remove,
  load,
};
