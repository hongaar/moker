import { plugins } from "@mokr/templates";
import { command } from "bandersnatch";
import ora from "ora";

export const use = command("use")
  .description("Add plugin to monorepo or workspace")
  .argument("name", {
    description: "Plugins name",
    choices: Object.keys(plugins),
    variadic: true,
  })
  .action(async ({ name }) => {
    const spinner = ora(`Adding plugin...`).start();

    spinner.succeed(`Created monorepo ${name}`);
  });
