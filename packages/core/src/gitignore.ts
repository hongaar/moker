import os from "node:os";
import { resolve } from "node:path";
import { isReadableAndWritableFile, readFile, writeFile } from "./file.js";

const FILENAME = ".gitignore";

export async function readGitignore({ directory }: { directory: string }) {
  return (await readFile({ path: resolve(directory, FILENAME) }))
    .trim()
    .split(os.EOL);
}

export async function writeGitignore({
  directory,
  lines,
  append = true,
}: {
  directory: string;
  lines: string[];
  append?: boolean;
}) {
  const path = resolve(directory, FILENAME);

  if (append && (await isReadableAndWritableFile({ path }))) {
    let existingLines = await readGitignore({ directory });

    lines = [...new Set([...existingLines, ...lines])];
  }

  return writeFile({
    path,
    contents: lines.join(os.EOL),
  });
}
