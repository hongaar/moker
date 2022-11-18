import {
  enqueueDependency,
  exec,
  installEnqueuedDependencies,
  PluginArgs,
  PluginLevel,
  writePackage,
} from "@mokr/core";

async function husky({ directory }: PluginArgs) {
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

husky.level = PluginLevel.Monorepo;

export { husky };
