import { hasPlugin, PluginArgs, PluginType } from "@mokr/core";
import {
  readDevcontainerJson,
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
    const id = "esbenp.prettier-vscode";
    const existingData = await readDevcontainerJson({ directory });

    if (!existingData.customizations?.vscode?.extensions?.includes(id)) {
      await writeDevcontainerJson({
        directory,
        data: {
          customizations: {
            vscode: {
              extensions: [id],
            },
          },
        },
      });
    }
  }
}

export const devcontainer = {
  type: PluginType.Repo,
  install,
  remove,
  load,
};
