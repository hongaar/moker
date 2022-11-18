import {
  enqueueDependency,
  exec,
  installEnqueuedDependencies,
  PluginArgs,
  PluginType,
  writePackage,
} from "@mokr/core";

async function install({ directory }: PluginArgs) {
  await enqueueDependency({ directory, identifier: "husky", dev: true });
  await installEnqueuedDependencies({ directory });
  await exec("yarn", ["husky", "install"], { cwd: directory });
  await writePackage({
    directory,
    data: {
      scripts: {
        postinstall: "husky install",
      },
    },
  });
}

async function refresh() {}

export const husky = {
  type: PluginType.Monorepo,
  install,
  refresh,
};
