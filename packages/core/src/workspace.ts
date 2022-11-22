import { dirname, join } from "node:path";
import { pkgUp } from "pkg-up";
import {
  createDirectory,
  isReadableAndWritableDirectory,
} from "./directory.js";
import { writeFile } from "./file.js";
import { getScoped, getWorkspacesDirectory } from "./monorepo.js";
import { readPackage, writePackage } from "./package.js";

type DirOption = {
  directory: string;
};

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

  const packageName = getScoped({ pkg }) ? `@${pkg.name}/${name}` : name;

  await createDirectory({ directory: workspaceDirectory });

  await writePackage({
    directory: workspaceDirectory,
    append: false,
    data: {
      name: packageName,
      version: pkg.version,
      license: pkg.license,
      author: pkg.author,
    },
  });

  await writeFile({
    path: join(workspaceDirectory, "README.md"),
    contents: `# ${packageName}`,
  });

  return workspaceDirectory;
}

export async function getMonorepoDirectory({ directory }: DirOption) {
  const path = await pkgUp({ cwd: dirname(directory) });

  if (path) {
    return dirname(path);
  }

  return;
}
