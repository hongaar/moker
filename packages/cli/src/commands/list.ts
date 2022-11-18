import { getPlugins } from "@mokr/core";
import { command } from "bandersnatch";

export const list = command("list")
  .description("List plugins and workspaces in a monorepo")
  .option("cwd", {
    description: "Directory to use as the current working directory",
    default: process.cwd(),
  })
  .action(async ({ cwd }) => {
    const plugins = await getPlugins({ directory: cwd });

    console.log(`Plugins: ${plugins.join(", ")}`);

    // @todo: list workspaces
    console.log(`Workspaces: ...`);
  });
