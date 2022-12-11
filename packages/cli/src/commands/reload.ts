import { loadAllPlugins, runDependencyQueues, task } from "@mokr/core";
import { command } from "bandersnatch";
import { resolve } from "node:path";

export const reload = command("reload")
  .hidden()
  .description("Reload plugins in repo or workspace")
  .option("cwd", {
    description: "Directory to use as the current working directory",
    default: process.cwd(),
  })
  .action(async ({ cwd }) => {
    const directory = resolve(cwd);

    await task(`Load plugins`, () => loadAllPlugins({ directory }));

    await task(`Update dependencies`, () =>
      runDependencyQueues({ directory: cwd })
    );
  });
