import {
  addYarnPlugin,
  enqueueInstallDependency,
  enqueueRemoveDependency,
  getMonorepoDirectory,
  logWarning,
  PluginArgs,
  PluginType,
  removeYarnPlugin,
  writeGitignore,
  writePackage,
} from "@mokr/core";
import { removeTsconfig, writeTsconfig } from "./tsconfig.js";

async function install({ directory }: PluginArgs) {
  const monorepoDirectory = await getMonorepoDirectory({ directory });

  if (!monorepoDirectory) {
    throw new Error("Could not find monorepo directory");
  }

  enqueueInstallDependency({
    directory,
    identifier: ["typescript", "@types/node"],
    dev: true,
  });

  await addYarnPlugin({ directory, name: "typescript" });

  await writeTsconfig({
    directory,
    data: {
      extends: "../../tsconfig.json",
      compilerOptions: {
        rootDir: "src",
        outDir: "dist",
        declarationDir: "types",
      },
      include: ["src/**/*"],
    },
  });

  await writeGitignore({
    directory,
    lines: ["# artifacts", "/dist", "/types"],
  });

  await writePackage({
    directory,
    data: {
      type: "module",
      main: "dist/index.js",
      types: "types/index.d.ts",
      files: ["dist", "types"],
      scripts: {
        prepublishOnly: "yarn build",
        clean: "rm -rf dist && rm -rf types",
        build: "yarn clean && tsc",
        "watch:build": "tsc --watch",
      },
    },
  });

  // At monorepo level

  await writeTsconfig({
    directory: monorepoDirectory,
    data: {
      $schema: "https://json.schemastore.org/tsconfig",
      display: "Node 16 + ESM + Strictest",
      compilerOptions: {
        lib: ["es2021"],
        module: "es2022",
        target: "es2021",
        moduleResolution: "node",
        strict: true,
        esModuleInterop: true,
        skipLibCheck: true,
        forceConsistentCasingInFileNames: true,
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
        declaration: true,
        declarationMap: true,
      },
    },
  });

  await writePackage({
    directory: monorepoDirectory,
    data: {
      scripts: {
        build: "yarn workspaces foreach --topological --verbose run build",
        "watch:build":
          "yarn workspaces foreach --parallel --interlaced run watch:build",
      },
    },
  });
}

async function remove({ directory }: PluginArgs) {
  const monorepoDirectory = await getMonorepoDirectory({ directory });

  if (!monorepoDirectory) {
    throw new Error("Could not find monorepo directory");
  }

  enqueueRemoveDependency({
    directory,
    identifier: ["typescript", "@types/node"],
  });

  await removeYarnPlugin({ directory, name: "typescript" });

  await removeTsconfig({ directory: monorepoDirectory });
  await removeTsconfig({ directory });

  logWarning("Please review your workspace and root package.json manually");
}

async function load() {}

export const typescript = {
  type: PluginType.Workspace,
  install,
  remove,
  load,
};
