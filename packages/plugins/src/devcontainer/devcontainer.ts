import { hasPlugin, PluginArgs, PluginType } from "@mokr/core";
import {
  removeDevcontainerJson,
  writeDevcontainerJson,
} from "./devcontainerJson.js";

async function install({ directory }: PluginArgs) {
  await writeDevcontainerJson({
    directory,
    data: {
      name: "Node.js & TypeScript",
      image: "mcr.microsoft.com/devcontainers/typescript-node:16-bullseye",
      features: {},
      forwardPorts: [],
      postCreateCommand: "yarn install",
      customizations: {},
    },
  });
}

async function remove({ directory }: PluginArgs) {
  await removeDevcontainerJson({ directory });
}

async function load({ directory }: PluginArgs) {
  if (await hasPlugin({ directory, name: "prettier" })) {
    await writeDevcontainerJson({
      directory,
      data: {
        customizations: {
          vscode: {
            extensions: ["esbenp.prettier-vscode"],
          },
        },
      },
    });
  }
}

export const devcontainer = {
  type: PluginType.Monorepo,
  install,
  remove,
  load,
};
