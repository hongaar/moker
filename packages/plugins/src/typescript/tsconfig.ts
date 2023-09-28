import { readJson, removeFile, writeJson } from "@mokr/core";
import path from "node:path";

// https://github.com/ffflorian/schemastore-updater/blob/main/schemas/tsconfig/index.d.ts
// https://github.com/microsoft/TypeScript/tree/main/lib
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
    target?: string;
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
    lib?: string[];
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

const TSCONFIG_FILENAME = "tsconfig.json";

export async function readTsconfig({
  directory,
  filename = TSCONFIG_FILENAME,
}: {
  directory: string;
  filename?: string;
}) {
  return readJson<Tsconfig>({
    path: path.join(directory, filename),
  });
}

export async function writeTsconfig({
  directory,
  data,
  filename = TSCONFIG_FILENAME,
}: {
  directory: string;
  data: Tsconfig;
  filename?: string;
}) {
  await writeJson({ path: path.join(directory, filename), data });
}

export async function removeTsconfig({
  directory,
  filename = TSCONFIG_FILENAME,
}: {
  directory: string;
  filename?: string;
}) {
  await removeFile({ path: path.join(directory, filename) });
}
