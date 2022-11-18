import {
  enqueueDependency,
  PluginArgs,
  PluginType,
  writeFile,
} from "@mokr/core";
import os from "node:os";
import { join } from "node:path";
import { writePrettierrc } from "./prettierrc.js";

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
  await enqueueDependency({ directory, identifier: "prettier", dev: true });
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

async function refresh() {}

export const prettier = {
  type: PluginType.Monorepo,
  install,
  refresh,
};
