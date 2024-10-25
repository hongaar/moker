import fs from "node:fs";
import { isReadableAndWritableFile } from "./file.js";

type DirOption = { directory: string };

export async function removeDirectory({ directory }: DirOption) {
  return fs.promises.rm(directory, { recursive: true });
}

/**
 * Recursively create directory.
 */
export async function createDirectory({ directory }: DirOption) {
  return fs.promises.mkdir(directory, { recursive: true });
}

/**
 * Removes all files from a directory.
 */
export async function emptyDirectory({ directory }: DirOption) {
  await removeDirectory({ directory });
  return createDirectory({ directory });
}

export async function isDirectory({ directory }: DirOption) {
  try {
    return (await fs.promises.stat(directory)).isDirectory();
  } catch {
    return false;
  }
}

export async function isReadableAndWritableDirectory({ directory }: DirOption) {
  return isReadableAndWritableFile({ path: directory });
}
