import { getPlugins, getWorkspaces } from "@mokr/core";
import { command } from "bandersnatch";
import { resolve } from "node:path";

export const list = command("list")
  .description("List plugins and workspaces in a monorepo")
  .option("cwd", {
    description: "Directory to use as the current working directory",
    default: process.cwd(),
  })
  .action(async ({ cwd }) => {
    const directory = resolve(cwd);

    const plugins = await getPlugins({ directory });
    const workspaces = await getWorkspaces({ directory });

    console.log(
      `Plugins:
${plugins.map((plugin) => `- ${plugin}\n`).join("")}`,
    );

    console.log(
      `Workspaces:
${workspaces
  .map(({ location, name }) => `- ${name} (${location})\n`)
  .join("")}`,
    );
  });
