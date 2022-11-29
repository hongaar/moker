import { basename, join } from "node:path";
import { isDirectory, isReadableAndWritableDirectory } from "./directory.js";
import { hasPackage, Package, writePackage } from "./package.js";
import { writeReadme } from "./workspace.js";
import {
  enqueueInstallDependency,
  initYarnExistingRepo,
  initYarnNewRepo,
} from "./yarn.js";

export const DEFAULT_LICENSE = "MIT";

export type RepoPackage = Package;

type DirOption = {
  directory: string;
};

export type CreateRepoOptions<T = Package> = DirOption & {
  license?: string;
  additionalPackageOptions?: T;
};

export async function createRepo({
  directory,
  license = DEFAULT_LICENSE,
  additionalPackageOptions,
}: CreateRepoOptions) {
  if (await isReadableAndWritableDirectory({ directory })) {
    await initYarnExistingRepo({ directory });
  } else {
    await initYarnNewRepo({ directory });
  }

  await writePackage({
    directory,
    data: {
      name: basename(directory),
      version: "0.0.0",
      license,
      moker: {
        plugins: [],
      },
      scripts: {
        build: "echo 'not implemented'",
        test: "echo 'not implemented'",
      },
    },
  });

  if (additionalPackageOptions) {
    await writePackage({ directory, data: additionalPackageOptions });
  }

  enqueueInstallDependency({
    directory,
    identifier: "moker",
    dev: true,
  });

  await writeReadme({ directory });
}

export async function isRepo({ directory }: DirOption) {
  return (
    (await isDirectory({ directory: join(directory, ".git") })) &&
    (await hasPackage({ directory }))
  );
}
