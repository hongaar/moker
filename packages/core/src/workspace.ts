import { join } from "node:path";
import {
  createDirectory,
  isReadableAndWritableDirectory,
} from "./directory.js";
import { writeFile } from "./file.js";
import { getScoped, getWorkspacesDirectory } from "./monorepo.js";
import { readPackage, writePackage } from "./package.js";

export async function addWorkspace({
  directory,
  name,
}: {
  directory: string;
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
