import { getPlugins, listWorkspaces } from "@mokr/core";
import { command } from "bandersnatch";

export const list = command("list")
  .description("List plugins and workspaces in a monorepo")
  .option("cwd", {
    description: "Directory to use as the current working directory",
    default: process.cwd(),
  })
  .action(async ({ cwd }) => {
    const plugins = await getPlugins({ directory: cwd });
    const workspaces = await listWorkspaces({ directory: cwd });

    console.log(
      `Plugins:
${plugins.map((plugin) => `- ${plugin}\n`).join("")}`
    );

    // @todo: list workspaces using https://yarnpkg.com/cli/workspaces/list
    console.log(
      `Workspaces:
${workspaces.map(({ location, name }) => `- ${name} (${location})\n`).join("")}`
    );
  });
