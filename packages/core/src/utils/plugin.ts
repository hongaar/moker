import { isMonorepo } from "../monorepo.js";
import { readPackage, writePackage } from "../package.js";
import { toCamelCase } from "./string.js";

export type PluginArgs = { directory: string };

export type Plugin = ((args: PluginArgs) => Promise<void>) & {
  level: string | PluginLevel;
};

export enum PluginLevel {
  Monorepo = "monorepo",
  Workspace = "workspace",
  Any = "any",
}

const CORE_PLUGINS = ["husky", "prettier", "lint-staged"];

export function isPlugin(plugin: unknown): plugin is Plugin {
  return !!(
    plugin &&
    typeof plugin === "function" &&
    // @ts-ignore
    typeof plugin?.level === "string"
  );
}

export async function runPlugin({
  directory,
  name,
}: {
  directory: string;
  name: string;
}) {
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
    if (plugin.level === "workspace") {
      throw new Error(`Plugin ${name} can only be used at workspace level`);
    }
  } else {
    if (plugin.level === "monorepo") {
      throw new Error(`Plugin ${name} can only be used at monorepo level`);
    }
  }

  await plugin({ directory });
  await writePackage({
    directory,
    data: {
      mokr: {
        plugins: [name],
      },
    },
  });
}

export async function hasPlugin({
  directory,
  name,
}: {
  directory: string;
  name: string;
}) {
  const { mokr } = await readPackage({ directory });

  return !!mokr?.plugins?.includes(name);
}
