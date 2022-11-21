import {
  installPlugin,
  loadAllPlugins,
  runDependencyQueues,
  task,
} from "@mokr/core";
import { command } from "bandersnatch";

export const use = command("use")
  .description("Add plugin to monorepo or workspace")
  .argument("plugin", {
    description: "Plugin name",
    variadic: true,
  })
  .option("cwd", {
    description: "Directory to use as the current working directory",
    default: process.cwd(),
  })
  .action(async ({ plugin, cwd }) => {
    for (const name of plugin) {
      await task(`Add plugin ${name}`, () =>
        installPlugin({ directory: cwd, name })
      );
    }

    await task(`Load plugins`, () => loadAllPlugins({ directory: cwd }));
    await task(`Update dependencies`, () =>
      runDependencyQueues({ directory: cwd })
    );
  });