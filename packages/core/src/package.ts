import { resolve } from "node:path";
import sortPackageJson from "sort-package-json";
import { isReadableAndWritableFile, removeFile } from "./file.js";
import { debug } from "./io.js";
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
  exports?: {
    import?: string;
    types?: string;
    require?: string;
    node?: string;
    default?: string;
    [k: string]: string | undefined;
  };
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

  moker?: MokerOptions;
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

type MokerOptions = {
  scoped?: boolean;
  plugins?: string[];
};

type LintStagedOptions = {
  [key: string]: string | string[];
};

const PACKAGE_FILENAME = "package.json";

export async function hasPackage({ directory }: { directory: string }) {
  return isReadableAndWritableFile({
    path: resolve(directory, PACKAGE_FILENAME),
  });
}

export async function readPackage({ directory }: { directory: string }) {
  return readJson<Package>({ path: resolve(directory, PACKAGE_FILENAME) });
}

export async function removePackage({ directory }: { directory: string }) {
  return removeFile({ path: resolve(directory, PACKAGE_FILENAME) });
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
  await writeJson({ path: resolve(directory, PACKAGE_FILENAME), data, append });
  await sortPackage({ directory });
}

export async function updatePackage({
  directory,
  merge,
}: {
  directory: string;
  merge: (existingData: Package) => Package;
}) {
  await updateJson({ path: resolve(directory, PACKAGE_FILENAME), merge });
  await sortPackage({ directory });
}

export async function sortPackage({ directory }: { directory: string }) {
  debug(`sorting "package.json" in "${directory}"`);

  await updateJson({
    path: resolve(directory, PACKAGE_FILENAME),
    merge: sortPackageJson,
  });
}
