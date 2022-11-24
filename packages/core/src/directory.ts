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
