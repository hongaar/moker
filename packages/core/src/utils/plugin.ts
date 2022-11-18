import { isMonorepo } from "../monorepo.js";
import { readPackage, writePackage } from "../package.js";
import { toCamelCase } from "./string.js";

export type PluginArgs = { directory: string };

export enum PluginType {
  Monorepo = "monorepo",
  Workspace = "workspace",
  Any = "any",
}

export type Plugin = {
  type: string | PluginType;
  install: (args: PluginArgs) => Promise<void>;
  refresh: (args: PluginArgs) => Promise<void>;
};

type PluginOptions = {
  directory: string;
  name: string;
};

const CORE_PLUGINS = [
  "husky",
  "prettier",
  "lint-staged",
  "devcontainer",
  "github-actions",
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
    typeof plugin?.refresh === "function"
  );
}

export async function getPlugin({ directory, name }: PluginOptions) {
  let plugin: Plugin;

  if (CORE_PLUGINS.includes(name)) {
    const { plugins } = await import("@mokr/templates");
    plugin = plugins[toCamelCase(name) as keyof typeof plugins];
  } else {
    plugin = await import(name);
  }

  if (!isPlugin(plugin)) {
    throw new Error(`Plugin ${name} does not exist or is not valid`);
  }

  // Monorepo level?
  if (await isMonorepo({ directory })) {
    if (plugin.type === "workspace") {
      throw new Error(`Plugin ${name} can only be used at workspace level`);
    }
  } else {
    if (plugin.type === "monorepo") {
      throw new Error(`Plugin ${name} can only be used at monorepo level`);
    }
  }

  return plugin;
}

export async function installPlugin({ directory, name }: PluginOptions) {
  if (await hasPlugin({ directory, name })) {
    throw new Error(`Plugin ${name} is already installed`);
  }

  const plugin = await getPlugin({ directory, name });

  await plugin.install({ directory });
  await writePackage({
    directory,
    data: {
      mokr: {
        plugins: [name],
      },
    },
  });
}

export async function refreshPlugin({ directory, name }: PluginOptions) {
  const plugin = await getPlugin({ directory, name });

  await plugin.refresh({ directory });
}

export async function getPlugins({ directory }: { directory: string }) {
  const { mokr } = await readPackage({ directory });

  return mokr?.plugins ?? [];
}

export async function refreshPlugins({ directory }: { directory: string }) {
  const plugins = await getPlugins({ directory });

  for (const name of plugins) {
    await refreshPlugin({ directory, name });
  }
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
