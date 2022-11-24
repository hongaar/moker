import fs from "node:fs";
import os from "node:os";
import { dirname } from "node:path";
import { createDirectory } from "./directory.js";

export async function readFile({ path }: { path: string }) {
  return fs.promises.readFile(path, "utf8");
}

/**
 * Write text file with UTF-8 encoding. The destination directory is created
 * first recursively.
 */
export async function writeFile({
  path,
  contents,
}: {
  path: string;
  contents: string;
}) {
  await createDirectory({ directory: dirname(path) });

  return fs.promises.writeFile(path, `${contents.trim()}${os.EOL}`, "utf8");
}

export async function copyFile({ from, to }: { from: string; to: string }) {
  await createDirectory({ directory: dirname(to) });

  return fs.promises.copyFile(from, to);
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
