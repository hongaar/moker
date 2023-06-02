import {
  formatTask,
  getWorkspaces,
  isMonorepo,
  loadAllPlugins,
  loadPluginsTask,
  task,
  updateDependenciesTask,
} from "@mokr/core";
import { command } from "bandersnatch";
import { resolve } from "node:path";

export const reload = command("reload")
  .description("Reload plugins in repo or workspace")
  .option("recursive", {
    type: "boolean",
    description: "Also reinstalls plugins of all workspaces in a monorepo",
  })
  .option("cwd", {
    description: "Directory to use as the current working directory",
    default: process.cwd(),
  })
  .action(async ({ recursive, cwd }) => {
    const directory = resolve(cwd);

    await loadPluginsTask({ directory });

    if (recursive && (await isMonorepo({ directory }))) {
      const workspaces = await getWorkspaces({ directory });

      for (const workspace of workspaces) {
        const workspaceDirectory = resolve(directory, workspace.location);

        // Skip root
        if (workspaceDirectory === directory) {
          continue;
        }

        await task(`Load plugins of ${workspace.name}`, () =>
          loadAllPlugins({ directory: workspaceDirectory })
        );
      }
    }

    await updateDependenciesTask({ directory });

    await formatTask({ directory });
  });
