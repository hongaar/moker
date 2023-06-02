import {
  PluginType,
  copyFile,
  hasPlugin,
  removeDirectory,
  type PluginArgs,
} from "@mokr/core";
import { join } from "node:path";
import { URL } from "node:url";

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
    from: new URL("../../static/ci.yml", import.meta.url).pathname,
    to: join(workflowDirectory, "ci.yml"),
  });

  await copyFile({
    from: new URL("../../static/update-node-versions.yml", import.meta.url)
      .pathname,
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
      from: new URL("../../static/release.yml", import.meta.url).pathname,
      to: join(workflowDirectory, "release.yml"),
    });
  }

  if (await hasPlugin({ directory, name: "prettier" })) {
    await copyFile({
      from: new URL("../../static/format-check.yml", import.meta.url).pathname,
      to: join(workflowDirectory, "format-check.yml"),
    });
  }

  if (await hasPlugin({ directory, name: "dependabot" })) {
    await copyFile({
      from: new URL("../../static/dependabot-automerge.yml", import.meta.url)
        .pathname,
      to: join(workflowDirectory, "dependabot-automerge.yml"),
    });

    await copyFile({
      from: new URL("../../static/reload-moker-plugins.yml", import.meta.url)
        .pathname,
      to: join(workflowDirectory, "reload-moker-plugins.yml"),
    });
  }
}

export const githubActions = {
  type: PluginType.Repo,
  install,
  remove,
  load,
};
