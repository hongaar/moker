import { removePlugin, task } from "@mokr/core";
import { command } from "bandersnatch";
import { resolve } from "node:path";
import { format, loadPlugins, updateDependencies } from "../../tasks.js";

export const remove = command("plugin")
  .description("Remove a plugin from the monorepo or workspace")
  .argument("name", {
    description: "Plugin name",
    variadic: true,
  })
  .option("cwd", {
    description: "Directory to use as the current working directory",
    default: process.cwd(),
  })
  .action(async ({ name, cwd }) => {
    const directory = resolve(cwd);

    for (const pluginName of name) {
      await task(`Remove plugin ${pluginName}`, () =>
        removePlugin({ directory, name: pluginName })
      );
    }

    await loadPlugins({ directory });

    await updateDependencies({ directory });

    await format({ directory });
  });
