import { command } from "bandersnatch";
import { resolve } from "node:path";
import { format, loadPlugins, updateDependencies } from "../tasks.js";

export const reload = command("reload")
  .hidden()
  .description("Reload plugins in repo or workspace")
  .option("cwd", {
    description: "Directory to use as the current working directory",
    default: process.cwd(),
  })
  .action(async ({ cwd }) => {
    const directory = resolve(cwd);

    await loadPlugins({ directory });

    await updateDependencies({ directory });

    await format({ directory });
  });
