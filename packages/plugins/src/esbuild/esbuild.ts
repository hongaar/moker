import {
  PluginType,
  enqueueInstallDependency,
  enqueueRemoveDependency,
  getMonorepoDirectory,
  hasPlugin,
  updatePackage,
  warning,
  writeGitignore,
  writePackage,
  type PluginArgs,
} from "@mokr/core";

async function install({ directory }: PluginArgs) {
  enqueueInstallDependency({
    directory,
    identifier: "esbuild",
    dev: true,
  });

  await writeGitignore({
    directory,
    lines: ["", "# artifacts", "/dist"],
  });
}

async function remove({ directory }: PluginArgs) {
  enqueueRemoveDependency({
    directory,
    identifier: "esbuild",
  });

  await updatePackage({
    directory,
    merge: (existingData) => {
      delete existingData?.["scripts"]?.["build:typecheck"];
      delete existingData?.["scripts"]?.["build:bundle"];
      return existingData;
    },
  });

  warning("Please review your package.json manually");
}

async function load({ directory }: PluginArgs) {
  const monorepoDirectory = await getMonorepoDirectory({ directory });

  if (await hasPlugin({ directory, name: "typescript" })) {
    await writePackage({
      directory,
      data: {
        scripts: {
          build:
            "yarn build:clean && yarn build:typecheck && yarn build:bundle",
          "build:clean": "rm -rf dist",
          "build:typecheck": "tsc --noEmit",
          "build:bundle":
            "esbuild --bundle --platform=node --format=esm --target=es2022 --outdir=dist src/index.ts",
        },
      },
    });
  } else {
    await writePackage({
      directory,
      data: {
        type: "module",
        main: "dist/index.js",
        files: ["dist"],
        scripts: {
          build:
            "yarn build:clean && esbuild --bundle --platform=node --format=esm --target=es2022 --outdir=dist src/index.ts",
          "build:clean": "rm -rf dist",
          prepublish: "yarn build",
        },
      },
    });
  }

  if (monorepoDirectory) {
    // Monorepo scripts
    await writePackage({
      directory: monorepoDirectory,
      data: {
        scripts: {
          build: "yarn workspaces foreach --topological --verbose run build",
        },
      },
    });
  }
}

export const esbuild = {
  type: PluginType.RepoOrWorkspace,
  install,
  remove,
  load,
};
