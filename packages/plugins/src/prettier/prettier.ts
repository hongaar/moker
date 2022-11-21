import {
  enqueueInstallDependency,
  enqueueRemoveDependency,
  PluginArgs,
  PluginType,
  removeFile,
  writeFile,
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
  await writeFile({
    path: join(directory, ".prettierignore"),
    contents: PRETTIER_IGNORE.join(os.EOL),
  });
}

async function remove({ directory }: PluginArgs) {
  await enqueueRemoveDependency({ directory, identifier: "prettier" });
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
