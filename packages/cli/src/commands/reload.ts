import { loadAllPlugins, runDependencyQueues, task } from "@mokr/core";
import { command } from "bandersnatch";

export const reload = command("reload")
  .hidden()
  .description("Reload plugins in monorepo or workspace")
  .option("cwd", {
    description: "Directory to use as the current working directory",
    default: process.cwd(),
  })
  .action(async ({ cwd }) => {
    await task(`Load plugins`, () => loadAllPlugins({ directory: cwd }));
    await task(`Update dependencies`, () =>
      runDependencyQueues({ directory: cwd })
    );
  });
