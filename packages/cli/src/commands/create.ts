import {
  applyTemplate,
  createMonorepo,
  createRepo,
  DEFAULT_LICENSE,
  DEFAULT_SCOPED,
  DEFAULT_WORKSPACES_DIRECTORY,
  installPlugin,
  isReadableAndWritableDirectory,
  loadAllPlugins,
  runDependencyQueues,
  task,
} from "@mokr/core";
import { command } from "bandersnatch";
import { resolve } from "node:path";

export const create = command("create")
  .description("Create a new repo")
  .argument("path", {
    description: "Repo path, basename will be used as the name.",
    prompt: "What is the name of your repo?",
  })
  .option("monorepo", {
    description: "Create a monorepo instead of a single-purpose repo",
    type: "boolean",
  })
  .option("template", {
    description: "Use repo template",
    type: "string",
  })
  .option("plugin", {
    description: "Kick-start with this plugin",
    type: "array",
    default: [] as string[],
  })
  .option("license", {
    description: "License",
    choices: ["MIT", "GPLv3"],
    prompt: "What license do you want to publish your packages with?",
    default: DEFAULT_LICENSE,
  })
  .option("workspacesDirectory", {
    description: "Workspaces directory (only used with --monorepo)",
    default: DEFAULT_WORKSPACES_DIRECTORY,
  })
  .option("scoped", {
    description: "Use scoped packages (only used with --monorepo)",
    boolean: true,
    default: DEFAULT_SCOPED,
  })
  .option("force", {
    description:
      "Initialize repo even if path already exists. WARNING: some files may be overwritten!",
    type: "boolean",
  })
  .action(async ({ path, monorepo, template, plugin, force, ...options }) => {
    const directory = resolve(path);
    const type = monorepo ? "monorepo" : "repo";
    const initializer = monorepo ? createMonorepo : createRepo;

    if ((await isReadableAndWritableDirectory({ directory })) && !force) {
      throw new Error(`${directory} already exists`);
    }

    await task(`Create new ${type} in ${directory}`, () =>
      initializer({ directory, ...options })
    );

    if (template) {
      await task(`Apply template ${template}`, () =>
        applyTemplate({ directory, name: template })
      );
    }

    for (const name of plugin) {
      await task(`Add plugin ${name}`, () =>
        installPlugin({ directory, name })
      );
    }

    await task(`Load plugins`, () => loadAllPlugins({ directory }));

    await task(`Update dependencies`, () => runDependencyQueues({ directory }));
  });
