import { resolve } from "node:path";
import { removeFile } from "./file.js";
import { readJson, writeJson } from "./json.js";
import type { Undefinable } from "./utils/types.js";

export type Tasks = {
  version: "2.0.0";
  tasks: {
    type: "typescript";
    tsconfig: string;
    option: string;
    group: string;
    label: string;
  }[];
};

const TASKS_FILENAME = ".vscode/tasks.json";

export async function readTasks({ directory }: { directory: string }) {
  return readJson<Tasks>({ path: resolve(directory, TASKS_FILENAME) });
}

export async function removeTasks({ directory }: { directory: string }) {
  return removeFile({ path: resolve(directory, TASKS_FILENAME) });
}

export async function writeTasks({
  directory,
  data,
  append = true,
}: {
  directory: string;
  data: Undefinable<Tasks>;
  append?: boolean;
}) {
  await writeJson({ path: resolve(directory, TASKS_FILENAME), data, append });
}
