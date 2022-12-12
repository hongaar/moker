import { isMonorepo } from "./monorepo.js";
import { readPackage, updatePackage, writePackage } from "./package.js";
import { isRepo } from "./repo.js";
import { toCamelCase } from "./utils/string.js";
import { isWorkspace } from "./workspace.js";

export type PluginArgs = { directory: string };

export enum PluginType {
  Repo = "repo",
  RepoOrWorkspace = "repoOrWorkspace",
  Monorepo = "monorepo",
  Workspace = "workspace",
}

export type Plugin = {
  type: PluginType;
  install: (args: PluginArgs) => Promise<void>;
  remove: (args: PluginArgs) => Promise<void>;
  load: (args: PluginArgs) => Promise<void>;
};

type DirOption = {
  directory: string;
};

type PluginOptions = DirOption & {
  name: string;
};

const CORE_PLUGINS = [
  "husky",
  "prettier",
  "lint-staged",
  "devcontainer",
  "github-actions",
  "typescript",
  "jest",
  "semantic-release",
  "dependabot",
  "todos",
  "doctoc",
  "esbuild",
  "xv",
];

export function isPlugin(plugin: unknown): plugin is Plugin {
  return !!(
    plugin &&
    typeof plugin === "object" &&
    // @ts-ignore
    typeof plugin?.type === "string" &&
    // @ts-ignore
    typeof plugin?.install === "function" &&
    // @ts-ignore
    typeof plugin?.remove === "function" &&
    // @ts-ignore
    typeof plugin?.load === "function"
  );
}

export async function importPlugin({ directory, name }: PluginOptions) {
  let plugin: Plugin;

  if (CORE_PLUGINS.includes(name)) {
    // @ts-ignore
    const plugins: any = await import("@mokr/plugins");
    plugin = plugins[toCamelCase(name) as keyof typeof plugins];
  } else {
    plugin = await import(name);
  }

  if (!isPlugin(plugin)) {
    throw new Error(`Plugin ${name} does not exist or is not valid`);
  }

  await validateType({ directory, name, type: plugin.type });

  return plugin;
}

export async function validateType({
  directory,
  name,
  type,
}: DirOption & { name: string; type: PluginType }) {
  const repo = await isRepo({ directory });
  const monorepo = await isMonorepo({ directory });
  const workspace = await isWorkspace({ directory });

  switch (type) {
    case PluginType.Repo:
      if (!repo) {
        throw new Error(
          `Plugin or template ${name} can only be used at repo level`
        );
      }
      break;

    case PluginType.RepoOrWorkspace:
      if (!repo && !workspace) {
        throw new Error(
          `Plugin or template ${name} can only be used at repo or workspace level`
        );
      }
      break;

    case PluginType.Monorepo:
      if (!monorepo) {
        throw new Error(
          `Plugin or template ${name} can only be used at monorepo level`
        );
      }
      break;

    case PluginType.Workspace:
      if (!workspace) {
        throw new Error(
          `Plugin or template ${name} can only be used at workspace level`
        );
      }
      break;
  }
}

export async function installPlugin({ directory, name }: PluginOptions) {
  const plugin = await importPlugin({ directory, name });

  await plugin.install({ directory });

  await writePackage({
    directory,
    data: {
      moker: {
        plugins: [name],
      },
    },
  });
}

export async function removePlugin({ directory, name }: PluginOptions) {
  if (!(await hasPlugin({ directory, name }))) {
    throw new Error(`Plugin ${name} is not installed`);
  }

  const plugin = await importPlugin({ directory, name });

  await plugin.remove({ directory });

  await updatePackage({
    directory,
    merge: (existingData) => ({
      ...existingData,
      moker: {
        ...existingData.moker,
        plugins: (existingData.moker?.plugins || []).filter(
          (pluginName) => pluginName !== name
        ),
      },
    }),
  });
}

export async function loadPlugin({ directory, name }: PluginOptions) {
  const plugin = await importPlugin({ directory, name });

  await plugin.load({ directory });
}

export async function loadAllPlugins({ directory }: { directory: string }) {
  const plugins = await getPlugins({ directory });

  for (const name of plugins) {
    await loadPlugin({ directory, name });
  }
}

export async function getPlugins({ directory }: { directory: string }) {
  const { moker } = await readPackage({ directory });

  return moker?.plugins ?? [];
}

export async function hasPlugin({
  directory,
  name,
}: {
  directory: string;
  name: string;
}) {
  const plugins = await getPlugins({ directory });

  return !!plugins.includes(name);
}
