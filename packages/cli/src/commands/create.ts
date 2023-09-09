import {
  applyTemplate,
  AVAILABLE_LICENSES,
  createMonorepo,
  createRepo,
  DEFAULT_LICENSE,
  DEFAULT_SCOPED,
  DEFAULT_WORKSPACES_DIRECTORY,
  formatTask,
  getUsername,
  installPluginTask,
  isReadableAndWritableDirectory,
  loadPluginsTask,
  task,
  updateDependenciesTask,
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
    type: "array",
    default: [] as string[],
  })
  .option("plugin", {
    description: "Kick-start with this plugin",
    type: "array",
    default: [] as string[],
  })
  .option("license", {
    description: "License",
    choices: AVAILABLE_LICENSES,
    prompt: "What license do you want to publish your packages with?",
    default: DEFAULT_LICENSE,
  })
  .option("upstream", {
    description: "Upstream repository provider and user",
    prompt: "Optional upstream repository provider and user (e.g. github:user)",
    default: `github:${getUsername()}`,
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
  .action(
    async ({
      path,
      upstream,
      monorepo,
      template,
      plugin,
      force,
      ...options
    }) => {
      const directory = resolve(path);
      const type = monorepo ? "monorepo" : "repo";
      const initializer = monorepo ? createMonorepo : createRepo;

      if ((await isReadableAndWritableDirectory({ directory })) && !force) {
        throw new Error(`${directory} already exists`);
      }

      await task(`Create new ${type} in ${directory}`, () =>
        initializer({ directory, upstream, ...options }),
      );

      for (const name of template) {
        await task(`Apply template ${name}`, () =>
          applyTemplate({ directory, name: name as string }),
        );
      }

      for (const name of plugin) {
        await installPluginTask({ directory, name: name as string });
      }

      await loadPluginsTask({ directory });

      await updateDependenciesTask({ directory });

      await formatTask({ directory });
    },
  );
