import {
  PluginType,
  addYarnPlugin,
  enqueueInstallDependency,
  enqueueRemoveDependency,
  getMonorepoDirectory,
  removeYarnPlugin,
  warning,
  writeGitignore,
  writePackage,
  writeTasks,
  type PluginArgs,
} from "@mokr/core";
import deepmerge from "deepmerge";
import { removeTsconfig, writeTsconfig, type Tsconfig } from "./tsconfig.js";

const TSCONFIG_WORKSPACE: Tsconfig = {
  compilerOptions: {
    rootDir: "src",
    outDir: "dist",
    declarationDir: "types",
  },
  include: ["src/**/*"],
};

const TSCONFIG_ROOT: Tsconfig = {
  $schema: "https://json.schemastore.org/tsconfig",
  references: [],
  files: [],
};

// https://github.com/tsconfig/bases/tree/main/bases
const TSCONFIG_BASE: Tsconfig = {
  $schema: "https://json.schemastore.org/tsconfig",
  display: "Node 20 + ESM + Strictest",
  compilerOptions: {
    composite: true,
    lib: ["es2023"],
    module: "node16",
    moduleResolution: "node16",
    target: "es2022",
    strict: true,
    esModuleInterop: true,
    skipLibCheck: true,
    forceConsistentCasingInFileNames: true,
    verbatimModuleSyntax: true,
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
      exports: {
        import: "./dist/index.js",
        types: "./types/index.d.ts",
      },
      files: ["dist", "types"],
      scripts: {
        build: "yarn build:clean && tsc --build --force",
        "build:watch": "tsc --build --watch",
        "build:clean": "tsc --build --clean",
        prepublish: "yarn build",
      },
    },
  });

  await writeTasks({
    directory: monorepoDirectory ?? directory,
    data: {
      version: "2.0.0",
      tasks: [
        {
          type: "typescript",
          tsconfig: "tsconfig.json",
          option: "watch",
          group: "build",
          label: "tsc: watch - tsconfig.json",
        },
      ],
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
        extends: "../../tsconfig.base.json",
        compilerOptions: {
          paths: {},
          ...TSCONFIG_BASE.compilerOptions,
        },
        references: [],
        ...TSCONFIG_WORKSPACE,
      },
    });

    // Monorepo base tsconfig
    await writeTsconfig({
      directory: monorepoDirectory,
      data: TSCONFIG_BASE,
      filename: "tsconfig.base.json",
    });

    // Monorepo root tsconfig
    await writeTsconfig({
      directory: monorepoDirectory,
      data: TSCONFIG_ROOT,
    });

    // Monorepo dependencies
    enqueueInstallDependency({
      directory: monorepoDirectory,
      identifier: ["typescript"],
      dev: true,
    });

    // Monorepo scripts
    await writePackage({
      directory: monorepoDirectory,
      data: {
        scripts: {
          build: "yarn workspaces foreach --topological --verbose run build",
          "build:watch":
            "yarn workspaces foreach --parallel --interlaced run build:watch",
          "build:clean":
            "yarn workspaces foreach --topological --verbose run build:clean",
          typescript: "yarn build:clean && tsc --build --force",
          "typescript:watch": "tsc --build --watch",
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

    enqueueRemoveDependency({
      directory: monorepoDirectory,
      identifier: ["typescript"],
    });
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
