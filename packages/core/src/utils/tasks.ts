import { task } from "../io.js";
import {
  installPlugin as coreInstallPlugin,
  hasPlugin,
  loadAllPlugins,
} from "../plugin.js";
import { applyTemplate } from "../template.js";
import { getMonorepoDirectory } from "../workspace.js";
import { runDependencyQueues } from "../yarn.js";
import { exec } from "./exec.js";

type DirOption = {
  directory: string;
};

export async function formatTask({ directory }: DirOption) {
  if (await hasPlugin({ directory, name: "prettier" })) {
    await task(`Format code`, () =>
      exec("yarn", ["format"], { cwd: directory }),
    );
  }
}

export async function applyTemplateTask({
  directory,
  name,
}: DirOption & { name: string }) {
  await task(`Apply template ${name}`, (spinner) =>
    applyTemplate({
      directory,
      name,
      beforeApply: (template) => {
        if (template.interactive) {
          spinner.stopAndPersist({
            suffixText: "(interactive mode)",
            symbol: "…",
          });
        }
      },
      afterApply: (template) => {
        if (template.interactive) {
          spinner.start();
        }
      },
    }),
  );
}

export async function installPluginTask({
  directory,
  name,
}: DirOption & { name: string }) {
  await task(`Install plugin ${name}`, () =>
    coreInstallPlugin({ directory, name }),
  );
}

export async function loadPluginsTask({ directory }: DirOption) {
  await task(`Load plugins`, () => loadAllPlugins({ directory }));
}

export async function updateDependenciesTask({ directory }: DirOption) {
  const monorepoDirectory = await getMonorepoDirectory({ directory });

  await task(
    `Update${monorepoDirectory ? " workspace" : ""} dependencies`,
    () => runDependencyQueues({ directory }),
  );

  if (monorepoDirectory) {
    await task(`Update monorepo dependencies`, () =>
      runDependencyQueues({ directory: monorepoDirectory }),
    );
  }
}
