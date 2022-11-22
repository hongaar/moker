import { readJson, removeFile, writeJson } from "@mokr/core";
import path from "node:path";

// https://github.com/ffflorian/schemastore-updater/blob/main/schemas/tsconfig/index.d.ts
export type Tsconfig = CompilerOptionsDefinition &
  CompileOnSaveDefinition &
  TypeAcquisitionDefinition &
  ExtendsDefinition &
  TsNodeDefinition &
  (
    | FilesDefinition
    | ExcludeDefinition
    | IncludeDefinition
    | ReferencesDefinition
  );

type CompilerOptionsDefinition = {
  compilerOptions?: {
    charset?: string;
    composite?: boolean;
    declaration?: boolean;
    declarationDir?: string;
    diagnostics?: boolean;
    emitBOM?: boolean;
    emitDeclarationOnly?: boolean;
    incremental?: boolean;
    tsBuildInfoFile?: string;
    inlineSourceMap?: boolean;
    inlineSources?: boolean;
    jsx?: "preserve" | "react" | "react-native";
    reactNamespace?: string;
    listFiles?: boolean;
    mapRoot?: string;
    module?:
      | "commonjs"
      | "amd"
      | "system"
      | "umd"
      | "es6"
      | "es2015"
      | "es2020"
      | "es2022"
      | "esnext"
      | "node16"
      | "nodenext"
      | "none";
    newLine?: "crlf" | "lf";
    noEmit?: boolean;
    noEmitHelpers?: boolean;
    noEmitOnError?: boolean;
    noImplicitAny?: boolean;
    noImplicitThis?: boolean;
    noUnusedLocals?: boolean;
    noUnusedParameters?: boolean;
    noLib?: boolean;
    noResolve?: boolean;
    noStrictGenericChecks?: boolean;
    skipDefaultLibCheck?: boolean;
    skipLibCheck?: boolean;
    outFile?: string;
    outDir?: string;
    preserveConstEnums?: boolean;
    preserveSymlinks?: boolean;
    preserveWatchOutput?: boolean;
    pretty?: boolean;
    removeComments?: boolean;
    rootDir?: string;
    isolatedModules?: boolean;
    sourceMap?: boolean;
    sourceRoot?: string;
    suppressExcessPropertyErrors?: boolean;
    suppressImplicitAnyIndexErrors?: boolean;
    stripInternal?: boolean;
    target?:
      | "es3"
      | "es5"
      | "es6"
      | "es2015"
      | "es2016"
      | "es2017"
      | "es2018"
      | "es2019"
      | "es2020"
      | "es2021"
      | "es2022"
      | "esnext";
    watch?: boolean;
    experimentalDecorators?: boolean;
    emitDecoratorMetadata?: boolean;
    moduleResolution?: "classic" | "node" | "node16" | "nodenext";
    allowUnusedLabels?: boolean;
    noImplicitReturns?: boolean;
    noFallthroughCasesInSwitch?: boolean;
    allowUnreachableCode?: boolean;
    forceConsistentCasingInFileNames?: boolean;
    baseUrl?: string;
    paths?: {
      [k: string]: string[];
    };
    plugins?: {
      name?: string;
      [k: string]: any;
    }[];
    rootDirs?: string[];
    typeRoots?: string[];
    types?: string[];
    traceResolution?: boolean;
    allowJs?: boolean;
    noErrorTruncation?: boolean;
    allowSyntheticDefaultImports?: boolean;
    noImplicitUseStrict?: boolean;
    listEmittedFiles?: boolean;
    disableSizeLimit?: boolean;
    lib?: (
      | "es5"
      | "es6"
      | "es7"
      | "es2015"
      | "es2015.collection"
      | "es2015.core"
      | "es2015.generator"
      | "es2015.iterable"
      | "es2015.promise"
      | "es2015.proxy"
      | "es2015.reflect"
      | "es2015.symbol.wellknown"
      | "es2015.symbol"
      | "es2016"
      | "es2016.array.include"
      | "es2017"
      | "es2017.intl"
      | "es2017.object"
      | "es2017.sharedmemory"
      | "es2017.string"
      | "es2017.typedarrays"
      | "es2018"
      | "es2018.asynciterable"
      | "es2018.intl"
      | "es2018.promise"
      | "es2018.regexp"
      | "es2019"
      | "es2019.array"
      | "es2019.object"
      | "es2019.string"
      | "es2019.symbol"
      | "es2020"
      | "es2020.bigint"
      | "es2020.promise"
      | "es2020.string"
      | "es2020.symbol.wellknown"
      | "es2021"
      | "es2021.promise"
      | "es2021.string"
      | "es2021.weakref"
      | "esnext"
      | "esnext.array"
      | "esnext.asynciterable"
      | "esnext.bigint"
      | "esnext.intl"
      | "esnext.symbol"
      | "dom"
      | "dom.iterable"
      | "scripthost"
      | "webworker"
      | "webworker.importscripts"
    )[];
    strictNullChecks?: boolean;
    maxNodeModuleJsDepth?: number;
    importHelpers?: boolean;
    importsNotUsedAsValues?: "remove" | "preserve" | "error";
    jsxFactory?: string;
    alwaysStrict?: boolean;
    strict?: boolean;
    strictBindCallApply?: boolean;
    downlevelIteration?: boolean;
    checkJs?: boolean;
    strictFunctionTypes?: boolean;
    strictPropertyInitialization?: boolean;
    esModuleInterop?: boolean;
    allowUmdGlobalAccess?: boolean;
    keyofStringsOnly?: boolean;
    useDefineForClassFields?: boolean;
    declarationMap?: boolean;
    resolveJsonModule?: boolean;
    assumeChangesOnlyAffectDirectDependencies?: boolean;
    [k: string]: any;
  };
  [k: string]: any;
};

type CompileOnSaveDefinition = {
  compileOnSave?: boolean;
  [k: string]: any;
};

type TypeAcquisitionDefinition = {
  typeAcquisition?: {
    enable?: boolean;
    include?: string[];
    exclude?: string[];
    [k: string]: any;
  };
  [k: string]: any;
};

type ExtendsDefinition = {
  extends?: string;
  [k: string]: any;
};

type TsNodeDefinition = {
  "ts-node"?: {
    [k: string]: any;
  };
};

type FilesDefinition = {
  files?: string[];
  [k: string]: any;
};

type ExcludeDefinition = {
  exclude?: string[];
  [k: string]: any;
};

type IncludeDefinition = {
  include?: string[];
  [k: string]: any;
};

type ReferencesDefinition = {
  references?: {
    path?: string;
    [k: string]: any;
  }[];
  [k: string]: any;
};

const FILENAME = "tsconfig.json";

export async function readTsconfig({ directory }: { directory: string }) {
  return readJson<Tsconfig>({
    path: path.join(directory, FILENAME),
  });
}

export async function writeTsconfig({
  directory,
  data,
}: {
  directory: string;
  data: Tsconfig;
}) {
  await writeJson({ path: path.join(directory, FILENAME), data });
}

export async function removeTsconfig({ directory }: { directory: string }) {
  await removeFile({ path: path.join(directory, FILENAME) });
}
