import deepmerge from "deepmerge";

import { isReadableAndWritableFile, readFile, writeFile } from "./file.js";
import { isPlainObject, JSONValue } from "./utils/types.js";

export async function readJson<T extends JSONValue>({
  path,
}: {
  path: string;
}) {
  return JSON.parse(await readFile({ path })) as T;
}

export async function writeJson<T extends JSONValue>({
  path,
  data,
  append = true,
}: {
  path: string;
  data: T;
  append?: boolean;
}) {
  if (append && (await isReadableAndWritableFile({ path }))) {
    let existingData = await readJson<T>({ path });

    if (!isPlainObject(existingData)) {
      throw new Error("Can't currently write non-plain objects");
    }

    data = deepmerge<T>(existingData, data);
  }

  return writeFile({
    path,
    contents: JSON.stringify(data, undefined, 2),
  });
}
