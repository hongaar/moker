import { basename, dirname, join } from "node:path";
import { pkgUp } from "pkg-up";
import { isReadableAndWritableDirectory } from "./directory.js";
import { writeFile } from "./file.js";
import { getScoped, getWorkspacesDirectory, isMonorepo } from "./monorepo.js";
import { hasPackage, readPackage, writePackage } from "./package.js";

type DirOption = {
  directory: string;
};

const DEFAULT_INITIAL_VERSION = "0.0.0";

export async function addWorkspace({
  directory,
  name,
}: DirOption & {
  name: string;
}) {
  const pkg = await readPackage({ directory });
  const workspaceDirectory = join(
    getWorkspacesDirectory({ pkg, directory }),
    name
  );

  if (await isReadableAndWritableDirectory({ directory: workspaceDirectory })) {
    throw new Error(`${workspaceDirectory} already exists`);
  }

  const isScoped = getScoped({ pkg });
  const packageName = isScoped ? `@${pkg.name}/${name}` : name;

  await writePackage({
    directory: workspaceDirectory,
    append: false,
    data: {
      name: packageName,
      version: DEFAULT_INITIAL_VERSION,
      license: pkg.license,
      author: pkg.author,
      repository: pkg.repository,
      moker: {
        plugins: [],
      },
    },
  });

  await writeReadme({ directory, name: packageName });

  return workspaceDirectory;
}

export async function writeReadme({
  directory,
  name,
}: DirOption & { name?: string }) {
  await writeFile({
    path: join(directory, "README.md"),
    contents: `# ${name ?? basename(directory)}`,
  });
}

export async function isWorkspace({ directory }: DirOption) {
  if (!(await hasPackage({ directory }))) {
    return false;
  }

  if (await getMonorepoDirectory({ directory })) {
    return true;
  }

  return false;
}

export async function getMonorepoDirectory({ directory }: DirOption) {
  const path = await pkgUp({ cwd: dirname(directory) });

  if (!path) {
    return;
  }

  const parentPackageDirectory = dirname(path);

  return (await isMonorepo({ directory: parentPackageDirectory }))
    ? parentPackageDirectory
    : undefined;
}
