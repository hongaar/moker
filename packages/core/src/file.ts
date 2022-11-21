import fs from "node:fs";

export async function readFile({ path }: { path: string }) {
  return fs.promises.readFile(path, "utf8");
}

export async function writeFile({
  path,
  contents,
}: {
  path: string;
  contents: string;
}) {
  return fs.promises.writeFile(path, contents, "utf8");
}

export async function removeFile({ path }: { path: string }) {
  return fs.promises.rm(path);
}

export async function isAccessibleFile({
  path,
  mode,
}: {
  path: string;
  mode: number;
}) {
  try {
    await fs.promises.access(path, mode);
    return true;
  } catch {
    return false;
  }
}

export async function isReadableFile({ path }: { path: string }) {
  return isAccessibleFile({ path, mode: fs.constants.R_OK });
}

export async function isWritableFile({ path }: { path: string }) {
  return isAccessibleFile({ path, mode: fs.constants.W_OK });
}

export async function isReadableAndWritableFile({ path }: { path: string }) {
  return isAccessibleFile({
    path,
    mode: fs.constants.R_OK | fs.constants.W_OK,
  });
}
