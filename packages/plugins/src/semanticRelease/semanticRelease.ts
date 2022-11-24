import {
  enqueueInstallDependency,
  enqueueRemoveDependency,
  logInfo,
  PluginArgs,
  PluginType,
  removeFile,
  writeFile,
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
    "@semantic-release/npm",
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

const NPMRC_FILENAME = ".npmrc";
const NPMRC = `
workspaces = true
workspaces-update = false
`;

async function install({ directory }: PluginArgs) {
  enqueueInstallDependency({
    directory,
    identifier: [
      "@semantic-release/changelog",
      "@semantic-release/git",
      "semantic-release",
    ],
    dev: true,
  });

  await writeJson({
    path: join(directory, CONFIG_FILENAME),
    data: CONFIG,
  });

  await writeFile({
    path: join(directory, NPMRC_FILENAME),
    contents: NPMRC,
  });

  await writePackage({
    directory,
    data: {
      scripts: {
        release: "semantic-release",
      },
    },
  });

  logInfo(
    `semantic-release in our monorepo configuration is currently broken due to https://github.com/semantic-release/npm/pull/529`
  );
}

async function remove({ directory }: PluginArgs) {
  enqueueRemoveDependency({
    directory,
    identifier: [
      "@semantic-release/changelog",
      "@semantic-release/git",
      "semantic-release",
    ],
  });

  await removeFile({
    path: join(directory, CONFIG_FILENAME),
  });

  await removeFile({
    path: join(directory, NPMRC_FILENAME),
  });
}

async function load() {}

export const semanticRelease = {
  type: PluginType.Monorepo,
  install,
  remove,
  load,
};
