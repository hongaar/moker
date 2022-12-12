import {
  getPlugins,
  getWorkspaces,
  installPlugin,
  isMonorepo,
  loadAllPlugins,
  task,
  warning,
} from "@mokr/core";
import { command } from "bandersnatch";
import { resolve } from "node:path";
import { REINSTALL_WARNING } from "../constants.js";
import { format, updateDependencies } from "../tasks.js";

export const reinstall = command("reinstall")
  .hidden()
  .description("Reinstalls all plugins in the current directory")
  .option("all", {
    type: "boolean",
    description: "Also reinstalls plugins of all workspaces in a monorepo",
  })
  .option("cwd", {
    description: "Directory to use as the current working directory",
    default: process.cwd(),
  })
  .action(async ({ all, cwd }) => {
    const directory = resolve(cwd);
    const plugins = await getPlugins({ directory });

    for (const name of plugins) {
      await task(`Reinstall plugin ${name}`, async () => {
        await installPlugin({ directory, name });
      });
    }

    await task(`Load plugins`, () => loadAllPlugins({ directory }));

    if (all && (await isMonorepo({ directory }))) {
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
              await installPlugin({ directory: workspaceDirectory, name });
            }
          );
        }

        await task(`Load plugins of ${workspace.name}`, () =>
          loadAllPlugins({ directory })
        );
      }
    }

    await updateDependencies({ directory });

    await format({ directory });

    warning(REINSTALL_WARNING);
  });
