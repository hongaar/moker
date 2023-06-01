import {
  formatTask,
  getPlugins,
  getWorkspaces,
  installPluginTask,
  isMonorepo,
  loadAllPlugins,
  task,
  updateDependenciesTask,
  warning,
} from "@mokr/core";
import { command } from "bandersnatch";
import { resolve } from "node:path";
import { REINSTALL_WARNING } from "../constants.js";

export const reinstall = command("reinstall")
  .description("Reinstalls all plugins in the current directory")
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
    const plugins = await getPlugins({ directory });

    for (const name of plugins) {
      await task(`Reinstall plugin ${name}`, async () => {
        await installPluginTask({ directory, name });
      });
    }

    await task(`Load plugins`, () => loadAllPlugins({ directory }));

    if (recursive && (await isMonorepo({ directory }))) {
      const workspaces = await getWorkspaces({ directory });

      for (const workspace of workspaces) {
        const workspaceDirectory = resolve(directory, workspace.location);
        const plugins = await getPlugins({ directory: workspaceDirectory });

        // Skip root
        if (workspaceDirectory === directory) {
          continue;
        }

        for (const name of plugins) {
          await task(
            `Reinstall plugin ${name} of ${workspace.name}`,
            async () => {
              await installPluginTask({ directory: workspaceDirectory, name });
            }
          );
        }

        await task(`Load plugins of ${workspace.name}`, () =>
          loadAllPlugins({ directory })
        );
      }
    }

    await updateDependenciesTask({ directory });

    await formatTask({ directory });

    warning(REINSTALL_WARNING);
  });
