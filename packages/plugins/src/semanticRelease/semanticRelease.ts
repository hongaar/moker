import {
  enqueueInstallDependency,
  enqueueRemoveDependency,
  PluginArgs,
  PluginType,
  removeFile,
  writeJson,
  writePackage,
} from "@mokr/core";
import { join } from "node:path";

const CONFIG_FILENAME = ".releaserc.json";
const CONFIG = {
  branches: ["main"],
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/changelog",
    "semantic-release-yarn",
    "@semantic-release/github",
    [
      "@semantic-release/git",
      {
        assets: ["CHANGELOG.md", "package.json", "packages/*/package.json"],
        message:
          "chore(release): ${nextRelease.version}\n\n${nextRelease.notes}\n\n[skip ci]",
      },
    ],
  ],
};

async function install({ directory }: PluginArgs) {
  enqueueInstallDependency({
    directory,
    identifier: [
      "@semantic-release/changelog",
      "@semantic-release/git",
      "semantic-release",
      "semantic-release-yarn",
    ],
    dev: true,
  });

  await writeJson({
    path: join(directory, CONFIG_FILENAME),
    data: CONFIG,
  });

  await writePackage({
    directory,
    data: {
      scripts: {
        release: "semantic-release",
      },
    },
  });
}

async function remove({ directory }: PluginArgs) {
  enqueueRemoveDependency({
    directory,
    identifier: [
      "@semantic-release/changelog",
      "@semantic-release/git",
      "semantic-release",
      "semantic-release-yarn",
    ],
  });

  await removeFile({
    path: join(directory, CONFIG_FILENAME),
  });
}

async function load() {}

export const semanticRelease = {
  type: PluginType.RepoOrWorkspace,
  install,
  remove,
  load,
};
