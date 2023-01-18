import { getLicense } from "license";
import { resolve } from "node:path";
import { readFile, writeFile } from "./file.js";
import type { AVAILABLE_LICENSES } from "./repo.js";

const FILENAME = "LICENSE";

export async function readLicense({ directory }: { directory: string }) {
  return readFile({ path: resolve(directory, FILENAME) });
}

export async function writeLicense({
  directory,
  contents,
}: {
  directory: string;
  contents: string;
}) {
  const path = resolve(directory, FILENAME);

  return writeFile({
    path,
    contents,
  });
}

export async function generateLicense({
  directory,
  license,
  author,
}: {
  directory: string;
  license: (typeof AVAILABLE_LICENSES)[number];
  author: string;
}) {
  const path = resolve(directory, FILENAME);
  const contents = getLicense(license, {
    author,
    year: String(new Date().getFullYear()),
  });

  /**
   * @todo Contents is not perfect yet, e.g.:
   * - On one line: "MIT License Copyright [...]"
   * - Lines should be wrapped at 80 characters
   */

  return writeFile({
    path,
    contents,
  });
}
