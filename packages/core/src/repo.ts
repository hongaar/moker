import hostedGitInfo from "hosted-git-info";
import { basename, join } from "node:path";
import { isDirectory, isReadableAndWritableDirectory } from "./directory.js";
import { generateLicense } from "./license.js";
import { hasPackage, Package, writePackage } from "./package.js";
import { exec, getAuthor } from "./utils/index.js";
import { writeReadme } from "./workspace.js";
import {
  enqueueInstallDependency,
  initYarnExistingRepo,
  initYarnNewRepo,
} from "./yarn.js";

export const AVAILABLE_LICENSES = ["MIT", "GPL-3.0"] as const;
export const DEFAULT_LICENSE: typeof AVAILABLE_LICENSES[number] = "MIT";

export type RepoPackage = Package;

type DirOption = {
  directory: string;
};

export type CreateRepoOptions<T = Package> = DirOption & {
  license?: typeof AVAILABLE_LICENSES[number];
  upstream: string | undefined;
  additionalPackageOptions?: T;
};

export async function createRepo({
  directory,
  license = DEFAULT_LICENSE,
  upstream,
  additionalPackageOptions,
}: CreateRepoOptions) {
  const name = basename(directory);
  const authorObject = await getAuthor();
  const author = `${authorObject.name} <${authorObject.email}>`;
  const repository = upstream ? `${upstream}/${name}` : undefined;

  if (await isReadableAndWritableDirectory({ directory })) {
    await initYarnExistingRepo({ directory });
  } else {
    await initYarnNewRepo({ directory });
  }

  await writePackage({
    directory,
    data: {
      name,
      version: "0.0.0",
      license,
      author,
      repository,
      moker: {
        plugins: [],
      },
      scripts: {
        build: "echo 'not implemented'",
        test: "echo 'not implemented'",
      },
    },
  });

  if (repository) {
    const gitRemoteUrl = hostedGitInfo.fromUrl(repository)?.ssh();

    if (gitRemoteUrl) {
      await exec("git", ["remote", "add", "origin", gitRemoteUrl], {
        cwd: directory,
      });
    }
  }

  if (additionalPackageOptions) {
    await writePackage({ directory, data: additionalPackageOptions });
  }

  enqueueInstallDependency({
    directory,
    identifier: "moker",
    dev: true,
  });

  await writeReadme({ directory });

  await generateLicense({ directory, license, author });
}

export async function isRepo({ directory }: DirOption) {
  return (
    (await isDirectory({ directory: join(directory, ".git") })) &&
    (await hasPackage({ directory }))
  );
}
