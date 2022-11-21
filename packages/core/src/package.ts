import { join } from "node:path";
import { isReadableAndWritableFile } from "./file.js";
import { readJson, updateJson, writeJson } from "./json.js";
import type { Undefinable } from "./utils/types.js";

// https://gist.github.com/iainreid820/5c1cc527fe6b5b7dba41fec7fe54bf6e
// @todo: review
export type Package = {
  name?: string;
  version?: string;
  description?: string;
  keywords?: string[];
  homepage?: string;
  bugs?: string | Bugs;
  license?: string;
  author?: string | Author;
  contributors?: string[] | Author[];
  files?: string[];
  main?: string;
  bin?: string | BinMap;
  man?: string | string[];
  directories?: Directories;
  repository?: string | Repository;
  scripts?: ScriptsMap;
  config?: Config;
  dependencies?: DependencyMap;
  devDependencies?: DependencyMap;
  peerDependencies?: DependencyMap;
  optionalDependencies?: DependencyMap;
  bundledDependencies?: string[];
  engines?: Engines;
  os?: string[];
  cpu?: string[];
  preferGlobal?: boolean;
  private?: boolean;
  publishConfig?: PublishConfig;

  workspaces?: string[];

  mokr?: MokrOptions;

  "lint-staged"?: LintStagedOptions;
};

type Author = {
  name: string;
  email?: string;
  homepage?: string;
};

type BinMap = {
  [commandName: string]: string;
};

type Bugs = {
  email: string;
  url: string;
};

type Config = {
  name?: string;
  config?: {};
};

type DependencyMap = {
  [dependencyName: string]: string;
};

type Directories = {
  lib?: string;
  bin?: string;
  man?: string;
  doc?: string;
  example?: string;
};

type Engines = {
  node?: string;
  npm?: string;
};

type PublishConfig = {
  access?: string;
  registry?: string;
};

type Repository = {
  type: string;
  url: string;
};

type ScriptsMap = {
  [scriptName: string]: string;
};

type MokrOptions = {
  scoped?: boolean;
  plugins?: string[];
};

type LintStagedOptions = {
  [key: string]: string | string[];
};

const FILENAME = "package.json";

export async function hasPackage({ directory }: { directory: string }) {
  return isReadableAndWritableFile({ path: join(directory, FILENAME) });
}

export async function readPackage({ directory }: { directory: string }) {
  return readJson<Package>({ path: join(directory, FILENAME) });
}

export async function writePackage({
  directory,
  data,
  append = true,
}: {
  directory: string;
  data: Undefinable<Package>;
  append?: boolean;
}) {
  await writeJson({ path: join(directory, FILENAME), data, append });
}

export async function updatePackage({
  directory,
  merge,
}: {
  directory: string;
  merge: (existingData: Package) => Package;
}) {
  await updateJson({ path: join(directory, FILENAME), merge });
}
