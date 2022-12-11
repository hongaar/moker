import { addWorkspace, applyTemplate, isMonorepo, task } from "@mokr/core";
import { command } from "bandersnatch";
import { resolve } from "node:path";
import {
  addPlugin,
  format,
  loadPlugins,
  updateDependencies,
} from "../tasks.js";

export const add = command("add")
  .description("Add a workspace to a monorepo")
  .argument("name", {
    description: "Name of the workspace",
    prompt: true,
    variadic: true,
  })
  .option("template", {
    description: "Use workspace template",
    type: "string",
  })
  .option("plugin", {
    description: "Kick-start with this plugin",
    type: "array",
    default: [] as string[],
  })
  .option("cwd", {
    description: "Directory to use as the current working directory",
    default: process.cwd(),
  })
  .action(async ({ name, template, plugin, cwd }) => {
    const directory = resolve(cwd);

    if (!(await isMonorepo({ directory }))) {
      throw new Error("Execute this command from within a monorepo");
    }

    for (const workspaceName of name) {
      const workspaceDirectory = await task(
        `Add workspace ${workspaceName}`,
        () => addWorkspace({ directory, name: workspaceName })
      );

      if (template) {
        await task(`Apply template ${template}`, () =>
          applyTemplate({ directory: workspaceDirectory, name: template })
        );
      }

      for (const name of plugin) {
        await addPlugin({ directory: workspaceDirectory, name });
      }

      await loadPlugins({ directory: workspaceDirectory });

      await updateDependencies({ directory: workspaceDirectory });
    }

    await format({ directory });
  });
