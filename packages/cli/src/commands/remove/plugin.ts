import {
  loadAllPlugins,
  removePlugin,
  runDependencyQueues,
  task,
} from "@mokr/core";
import { command } from "bandersnatch";

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
    for (const pluginName of name) {
      await task(`Remove plugin ${pluginName}`, () =>
        removePlugin({ directory: cwd, name: pluginName })
      );
    }

    await task(`Load plugins`, () => loadAllPlugins({ directory: cwd }));
    await task(`Update dependencies`, () =>
      runDependencyQueues({ directory: cwd })
    );
  });
