import { task } from "../io.js";
import {
  installPlugin as coreInstallPlugin,
  hasPlugin,
  loadAllPlugins,
} from "../plugin.js";
import { runDependencyQueues } from "../yarn.js";
import { exec } from "./exec.js";

type DirOption = {
  directory: string;
};

export async function formatTask({ directory }: DirOption) {
  if (await hasPlugin({ directory, name: "prettier" })) {
    await task(`Format code`, () =>
      exec("yarn", ["format"], { cwd: directory })
    );
  }
}

export async function installPluginTask({
  directory,
  name,
}: DirOption & { name: string }) {
  await task(`Install plugin ${name}`, () =>
    coreInstallPlugin({ directory, name })
  );
}

export async function loadPluginsTask({ directory }: DirOption) {
  await task(`Load plugins`, () => loadAllPlugins({ directory }));
}

export async function updateDependenciesTask({ directory }: DirOption) {
  await task(`Update dependencies`, () => runDependencyQueues({ directory }));
}
