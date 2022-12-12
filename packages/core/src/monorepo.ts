import { join } from "node:path";
import { Package, readPackage } from "./package.js";
import {
  createRepo,
  CreateRepoOptions,
  DEFAULT_LICENSE,
  isRepo,
} from "./repo.js";
import { addYarnPlugin } from "./yarn.js";

export const DEFAULT_SCOPED = true;
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

export type CreateMonorepoOptions = DirOption &
  CreateRepoOptions & {
    scoped?: boolean;
    workspacesDirectory?: string;
  };

export async function createMonorepo({
  directory,
  scoped = DEFAULT_SCOPED,
  license = DEFAULT_LICENSE,
  upstream,
  workspacesDirectory = DEFAULT_WORKSPACES_DIRECTORY,
}: CreateMonorepoOptions) {
  await createRepo({
    directory,
    license,
    upstream,
    additionalPackageOptions: {
      private: true,
      workspaces: [`${workspacesDirectory}/*`],
      moker: {
        scoped,
      },
    },
  });

  await addYarnPlugin({ directory, name: "workspace-tools" });
}

export async function isMonorepo({ directory }: DirOption) {
  if (!(await isRepo({ directory }))) {
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
