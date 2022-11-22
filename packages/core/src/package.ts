import { join } from "node:path";
import { isReadableAndWritableFile } from "./file.js";
import { readJson, updateJson, writeJson } from "./json.js";
import type { Undefinable } from "./utils/types.js";

// https://github.com/ffflorian/schemastore-updater/blob/main/schemas/package/index.d.ts
export type Package = {
  name?: string;
  version?: string;
  description?: string;
  keywords?: string[];
  homepage?:
    | {
        [k: string]: any;
      }
    | ".";
  bugs?:
    | {
        [k: string]: any;
      }
    | string;
  license?: string;
  licenses?: {
    type?: string;
    url?: string;
    [k: string]: any;
  }[];
  author?: Person;
  contributors?: Person[];
  maintainers?: Person[];
  type?: "module" | "commonjs";
  files?: string[];
  main?: string;
  bin?:
    | string
    | {
        [k: string]: any;
      };
  types?: string;
  typings?: string;
  man?: string[];
  directories?: {
    bin?: string;
    doc?: string;
    example?: string;
    lib?: string;
    man?: string;
    test?: string;
    [k: string]: any;
  };
  repository?:
    | {
        [k: string]: any;
      }
    | string;
  scripts?: {
    [k: string]: string | undefined;
  };
  config?: {
    [k: string]: any;
  };
  dependencies?: Dependency;
  devDependencies?: Dependency;
  optionalDependencies?: Dependency;
  peerDependencies?: Dependency;
  resolutions?: Dependency;
  engines?: {
    [k: string]: string;
  };
  engineStrict?: boolean;
  os?: string[];
  cpu?: string[];
  preferGlobal?: boolean;
  private?: boolean;
  publishConfig?: {
    [k: string]: any;
  };
  dist?: {
    shasum?: string;
    tarball?: string;
    [k: string]: any;
  };
  readme?: string;
  module?: string;
  esnext?:
    | string
    | {
        [k: string]: any;
      };
  workspaces?: string[];

  mokr?: MokrOptions;
  "lint-staged"?: LintStagedOptions;

  [k: string]: any;
};

type Person =
  | {
      [k: string]: any;
    }
  | string;

type Dependency = {
  [k: string]: string;
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
