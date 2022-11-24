import { join } from "node:path";
import {
  createDirectory,
  isReadableAndWritableDirectory,
} from "./directory.js";
import { hasPackage, Package, readPackage, writePackage } from "./package.js";
import { enqueueInstallDependency, initYarn } from "./yarn.js";

export const DEFAULT_SCOPED = true;
export const DEFAULT_LICENSE = "MIT";
export const DEFAULT_INITIAL_VERSION = "0.0.0";
export const DEFAULT_WORKSPACES_DIRECTORY = "packages";

export type MonorepoPackage = Package & {
  workspaces: NonNullable<Package["workspaces"]>;
};

type DirOption = {
  directory: string;
};

type PkgOption = {
  pkg: Package;
};

type CreateMonorepoOptions = DirOption & {
  scoped?: boolean;
  license?: string;
  initialVersion?: string;
  workspacesDirectory?: string;
};

export async function createMonorepo({
  directory,
  scoped = DEFAULT_SCOPED,
  license = DEFAULT_LICENSE,
  initialVersion = DEFAULT_INITIAL_VERSION,
  workspacesDirectory = DEFAULT_WORKSPACES_DIRECTORY,
}: CreateMonorepoOptions) {
  if (await isReadableAndWritableDirectory({ directory })) {
    throw new Error(`${directory} already exists`);
  }

  await createDirectory({ directory });

  await initYarn({ directory });

  await writePackage({
    directory,
    data: {
      private: true,
      license,
      version: initialVersion,
      workspaces: [`${workspacesDirectory}/*`],
      moker: {
        scoped,
        plugins: [],
      },
      scripts: {
        publish: "yarn publish",
      },
    },
  });

  enqueueInstallDependency({
    directory,
    identifier: "@mokr/cli",
    dev: true,
  });
}

export async function isMonorepo({ directory }: DirOption) {
  if (!(await hasPackage({ directory }))) {
    return false;
  }

  const pkg = await readPackage({ directory });

  return checkMonorepo({ pkg });
}

function checkMonorepo(
  options: PkgOption
): options is { pkg: MonorepoPackage } {
  const { pkg } = options;

  if (typeof pkg.moker === "undefined") {
    return false;
  }

  return "scoped" in pkg.moker;
}

export function getWorkspacesDirectory({
  pkg,
  directory,
}: PkgOption & DirOption) {
  const workspaceDirectory = pkg.workspaces?.[0]?.replace("/*", "");

  if (!workspaceDirectory) {
    throw new Error("No workspace configuration found in package.json");
  }

  return join(directory, workspaceDirectory);
}

export function getScoped({ pkg }: PkgOption) {
  return pkg.moker?.scoped;
}