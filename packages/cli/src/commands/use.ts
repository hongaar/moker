import {
  installEnqueuedDependencies,
  installPlugin,
  refreshPlugins,
} from "@mokr/core";
import { command } from "bandersnatch";
import ora from "ora";

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
    let spinner;

    for (const name of plugin) {
      spinner = ora(`Adding plugin ${name}...`).start();
      await installPlugin({ directory: cwd, name });
      spinner.succeed(`Added plugin ${name}`);
    }

    spinner = ora(`Refreshing plugins...`).start();
    await refreshPlugins({ directory: cwd });
    spinner.succeed(`Refreshed plugins`);

    spinner = ora(`Installing dependencies...`).start();
    await installEnqueuedDependencies({ directory: cwd });
    spinner.succeed(`Installed dependencies`);
  });
