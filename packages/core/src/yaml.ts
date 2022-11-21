import deepmerge from "deepmerge";
import yaml from "yaml";

import { isReadableAndWritableFile, readFile, writeFile } from "./file.js";
import { isPlainObject, JSONValue } from "./utils/types.js";

export async function readYaml<T extends JSONValue>({
  path,
}: {
  path: string;
}) {
  return yaml.parse(await readFile({ path })) as T;
}

export async function writeYaml<T extends JSONValue>({
  path,
  data,
  append = true,
}: {
  path: string;
  data: T;
  append?: boolean;
}) {
  if (append && (await isReadableAndWritableFile({ path }))) {
    const existingData = await readYaml<T>({ path });

    if (!isPlainObject(existingData)) {
      throw new Error("Can't currently write non-plain objects");
    }

    data = deepmerge<T>(existingData, data);
  }

  return writeFile({
    path,
    contents: yaml.stringify(data),
  });
}
