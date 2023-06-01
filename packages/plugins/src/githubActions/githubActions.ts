import {
  PluginType,
  copyFile,
  hasPlugin,
  removeDirectory,
  toPathName,
  type PluginArgs,
} from "@mokr/core";
import { join } from "node:path";

const WORKFLOWS_DIRECTORY = ".github/workflows";

async function install({ directory }: PluginArgs) {
  const workflowDirectory = join(directory, WORKFLOWS_DIRECTORY);

  // Workspaces

  // Since there's currently no way to detect plugins in workspaces, we always
  // install the ci workflows.

  // We could build plugin detection in workspaces, but then we would need to
  // load all plugins at the monorepo level when we modify plugins at the
  // workspace level

  await copyFile({
    from: toPathName("../../static/ci.yml", {
      __dirname,
      importUrl: import.meta.url,
    }),
    to: join(workflowDirectory, "ci.yml"),
  });

  await copyFile({
    from: toPathName("../../static/update-node-versions.yml", {
      __dirname,
      importUrl: import.meta.url,
    }),
    to: join(workflowDirectory, "update-node-versions.yml"),
  });
}

async function remove({ directory }: PluginArgs) {
  const workflowDirectory = join(directory, WORKFLOWS_DIRECTORY);

  await removeDirectory({ directory: workflowDirectory });
}

async function load({ directory }: PluginArgs) {
  const workflowDirectory = join(directory, WORKFLOWS_DIRECTORY);

  // Monorepo plugins

  if (await hasPlugin({ directory, name: "semantic-release" })) {
    await copyFile({
      from: toPathName("../../static/release.yml", {
        __dirname,
        importUrl: import.meta.url,
      }),
      to: join(workflowDirectory, "release.yml"),
    });
  }

  if (await hasPlugin({ directory, name: "prettier" })) {
    await copyFile({
      from: toPathName("../../static/format-check.yml", {
        __dirname,
        importUrl: import.meta.url,
      }),
      to: join(workflowDirectory, "format-check.yml"),
    });
  }

  if (await hasPlugin({ directory, name: "dependabot" })) {
    await copyFile({
      from: toPathName("../../static/dependabot-automerge.yml", {
        __dirname,
        importUrl: import.meta.url,
      }),
      to: join(workflowDirectory, "dependabot-automerge.yml"),
    });
  }
}

export const githubActions = {
  type: PluginType.Repo,
  install,
  remove,
  load,
};
