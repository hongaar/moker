import {
  addYarnPlugin,
  enqueueInstallDependency,
  enqueueRemoveDependency,
  getMonorepoDirectory,
  PluginArgs,
  PluginType,
  removeYarnPlugin,
  warning,
  writeGitignore,
  writePackage,
} from "@mokr/core";
import deepmerge from "deepmerge";
import { removeTsconfig, Tsconfig, writeTsconfig } from "./tsconfig.js";

const TSCONFIG_WORKSPACE: Tsconfig = {
  compilerOptions: {
    rootDir: "src",
    outDir: "dist",
    declarationDir: "types",
  },
  include: ["src/**/*"],
};

// https://github.com/tsconfig/bases/blob/main/bases/node18-strictest-esm.combined.json
const TSCONFIG_BASE: Tsconfig = {
  $schema: "https://json.schemastore.org/tsconfig",
  display: "Node 18 + ESM + Strictest",
  compilerOptions: {
    lib: ["es2022"],
    module: "es2022",
    target: "es2022",
    strict: true,
    esModuleInterop: true,
    skipLibCheck: true,
    forceConsistentCasingInFileNames: true,
    moduleResolution: "node",
    allowUnusedLabels: false,
    allowUnreachableCode: false,
    exactOptionalPropertyTypes: true,
    noFallthroughCasesInSwitch: true,
    noImplicitOverride: true,
    noImplicitReturns: true,
    noPropertyAccessFromIndexSignature: true,
    noUncheckedIndexedAccess: true,
    noUnusedLocals: true,
    noUnusedParameters: true,
    importsNotUsedAsValues: "error",

    // Custom
    declaration: true,
    declarationMap: true,
  },
};

async function install({ directory }: PluginArgs) {
  const monorepoDirectory = await getMonorepoDirectory({ directory });

  enqueueInstallDependency({
    directory,
    identifier: ["typescript", "@types/node"],
    dev: true,
  });

  await addYarnPlugin({ directory, name: "typescript" });

  await writeGitignore({
    directory,
    lines: ["", "# artifacts", "/dist", "/types"],
  });

  await writePackage({
    directory,
    data: {
      type: "module",
      main: "dist/index.js",
      types: "types/index.d.ts",
      files: ["dist", "types"],
      scripts: {
        clean: "rm -rf dist && rm -rf types",
        build: "yarn clean && tsc",
        "build:watch": "tsc --watch",
        prepublish: "yarn build",
      },
    },
  });

  if (!monorepoDirectory) {
    // Single tsconfig
    await writeTsconfig({
      directory,
      data: deepmerge(TSCONFIG_BASE, TSCONFIG_WORKSPACE),
    });
  } else {
    // Workspace tsconfig
    await writeTsconfig({
      directory,
      data: {
        extends: "../../tsconfig.json",
        ...TSCONFIG_WORKSPACE,
      },
    });

    // Monorepo tsconfig
    await writeTsconfig({
      directory: monorepoDirectory,
      data: TSCONFIG_BASE,
    });

    // Monorepo scripts
    await writePackage({
      directory: monorepoDirectory,
      data: {
        scripts: {
          build: "yarn workspaces foreach --topological --verbose run build",
          "build:watch":
            "yarn workspaces foreach --parallel --interlaced run build:watch",
        },
      },
    });
  }
}

async function remove({ directory }: PluginArgs) {
  const monorepoDirectory = await getMonorepoDirectory({ directory });

  enqueueRemoveDependency({
    directory,
    identifier: ["typescript", "@types/node"],
  });

  await removeYarnPlugin({ directory, name: "typescript" });

  await removeTsconfig({ directory });

  if (monorepoDirectory) {
    await removeTsconfig({ directory: monorepoDirectory });
  }

  warning("Please review your package.json manually");
}

async function load() {}

export const typescript = {
  type: PluginType.RepoOrWorkspace,
  install,
  remove,
  load,
};
