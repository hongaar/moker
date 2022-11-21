import {
  createMonorepo,
  DEFAULT_INITIAL_VERSION,
  DEFAULT_LICENSE,
  DEFAULT_SCOPED,
  DEFAULT_WORKSPACES_DIRECTORY,
  installPlugin,
  loadAllPlugins,
  runDependencyQueues,
  task,
} from "@mokr/core";
import { command } from "bandersnatch";
import { resolve } from "node:path";

// @todo re-enable prompts

export const create = command("create")
  .description("Create a new monorepo")
  .argument("path", {
    description: "Monorepo path, basename will be used as the monorepo name.",
    // prompt: "What is the name of your monorepo?",
  })
  .option("plugin", {
    description: "Kick-start with this plugin",
    type: "array",
    default: [] as string[],
  })
  .option("scoped", {
    description: "Use scoped packages",
    boolean: true,
    // prompt: "Do you want to use scoped package names?",
    default: DEFAULT_SCOPED,
  })
  .option("license", {
    description: "License",
    choices: ["MIT", "GPLv3"],
    // prompt: "What license do you want to publish your packages with?",
    default: DEFAULT_LICENSE,
  })
  .option("initialVersion", {
    description: "Initial version",
    // prompt: "What version do you want to start with?",
    default: DEFAULT_INITIAL_VERSION,
  })
  .option("workspacesDirectory", {
    description: "Workspaces directory",
    // prompt: "Which directory should we save workspaces to?",
    default: DEFAULT_WORKSPACES_DIRECTORY,
  })
  .action(async ({ path, plugin, ...options }) => {
    const directory = resolve(path);

    await task(`Create new monorepo in ${directory}`, () =>
      createMonorepo({ directory, ...options })
    );

    for (const name of plugin) {
      await task(`Add plugin ${name}`, () =>
        installPlugin({ directory, name })
      );
    }

    await task(`Load plugins`, () => loadAllPlugins({ directory }));
    await task(`Update dependencies`, () => runDependencyQueues({ directory }));
  });
