import {
  addWorkspace,
  applyTemplate,
  installPlugin,
  isMonorepo,
  loadAllPlugins,
  runDependencyQueues,
  task,
} from "@mokr/core";
import { command } from "bandersnatch";

export const add = command("add")
  .description("Add a workspace to a monorepo")
  .argument("name", {
    description: "Name of the workspace",
    prompt: true,
    variadic: true,
  })
  .option("template", {
    description: "Use workspace template",
    type: "string",
  })
  .option("plugin", {
    description: "Kick-start with this plugin",
    type: "array",
    default: [] as string[],
  })
  .option("cwd", {
    description: "Directory to use as the current working directory",
    default: process.cwd(),
  })
  .action(async ({ name, template, plugin, cwd }) => {
    if (!(await isMonorepo({ directory: cwd }))) {
      throw new Error("Execute this command from within a monorepo");
    }

    for (const workspaceName of name) {
      const workspaceDirectory = await task(
        `Add workspace ${workspaceName}`,
        () => addWorkspace({ directory: cwd, name: workspaceName })
      );

      if (template) {
        await task(`Apply template ${template}`, () =>
          applyTemplate({ directory: workspaceDirectory, name: template })
        );
      }

      for (const name of plugin) {
        await task(`Add plugin ${name}`, () =>
          installPlugin({ directory: workspaceDirectory, name })
        );
      }

      await task(`Load plugins`, () =>
        loadAllPlugins({ directory: workspaceDirectory })
      );
      await task(`Update dependencies`, () =>
        runDependencyQueues({ directory: workspaceDirectory })
      );
    }

    // await asyncForEach(name, async (name) => {
    //   const directory = path.join(monorepo.directory, "packages", name);
    //   const spinner = ora(`Creating workspace ${name}...`).start();
    //   await new Workspace(monorepo, directory).create(
    //     workspace[template as keyof typeof workspace]
    //   );
    //   spinner.succeed(`Created workspace ${name}`);
    // });
  });
