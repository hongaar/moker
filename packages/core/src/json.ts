import deepmerge from "deepmerge";

import { isReadableAndWritableFile, readFile, writeFile } from "./file.js";
import {
  isPlainObject,
  JSONValue,
  StringableJSONValue,
} from "./utils/types.js";

export async function readJson<T extends JSONValue>({
  path,
}: {
  path: string;
}) {
  return JSON.parse(await readFile({ path })) as T;
}

export async function writeJson<T extends StringableJSONValue>({
  path,
  data,
  append = true,
}: {
  path: string;
  data: T;
  append?: boolean;
}) {
  if (append && (await isReadableAndWritableFile({ path }))) {
    const existingData = (await readJson({ path })) as T;

    if (!isPlainObject(existingData)) {
      throw new Error("Can't currently write non-plain objects");
    }

    data = deepmerge<T>(existingData, data);
  }

  return writeFile({
    path,
    contents: formatJson(data),
  });
}

export async function updateJson<T extends JSONValue>({
  path,
  merge,
}: {
  path: string;
  merge: (existingData: T) => T;
}) {
  if (!(await isReadableAndWritableFile({ path }))) {
    throw new Error(`File ${path} is not accessible`);
  }

  const existingData = await readJson<T>({ path });
  const data = merge(existingData);

  return writeFile({
    path,
    contents: formatJson(data),
  });
}

function formatJson(data: StringableJSONValue) {
  return JSON.stringify(data, undefined, 2);
}
