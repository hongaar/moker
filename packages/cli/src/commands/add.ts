import { asyncForEach, Monorepo, Workspace } from "@mokr/core";
import { workspace } from "@mokr/templates";
import { command } from "bandersnatch";
import ora from "ora";
import path from "path";

export const add = command("add")
  .description("Add a workspace to the monorepo")
  .argument("name", {
    description: "Name of the workspace",
    prompt: true,
    variadic: true,
  })
  .option("template", {
    description: "Use workspace template",
    choices: Object.keys(workspace),
    default: "lib",
  })
  .action(async ({ name, template }) => {
    const monorepo = Monorepo.find(process.cwd());

    if (!monorepo) {
      throw new Error("Execute this command from within a monorepo");
    }

    await asyncForEach(name, async (name) => {
      const directory = path.join(monorepo.directory, "packages", name);

      const spinner = ora(`Creating workspace ${name}...`).start();

      await new Workspace(monorepo, directory).create(
        workspace[template as keyof typeof workspace]
      );

      spinner.succeed(`Created workspace ${name}`);
    });
  });
