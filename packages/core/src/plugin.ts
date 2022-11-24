import { isMonorepo } from "./monorepo.js";
import { readPackage, updatePackage, writePackage } from "./package.js";
import { toCamelCase } from "./utils/string.js";

export type PluginArgs = { directory: string };

export enum PluginType {
  Monorepo = "monorepo",
  Workspace = "workspace",
  Any = "any",
}

export type Plugin = {
  type: string | PluginType;
  install: (args: PluginArgs) => Promise<void>;
  remove: (args: PluginArgs) => Promise<void>;
  load: (args: PluginArgs) => Promise<void>;
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
  "typescript",
  "jest",
  "semantic-release",
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
