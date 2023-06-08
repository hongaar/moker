import { readYaml, removeFile, writeYaml } from "@mokr/core";
import path from "node:path";

// http://json.schemastore.org/prettierrc
export type Prettierrc = {
  arrowParens?: "always" | "avoid";
  bracketSameLine?: boolean;
  bracketSpacing?: boolean;
  cursorOffset?: number;
  editorconfig?: boolean;
  embeddedLanguageFormatting?: "auto" | "off";
  endOfLine?: "lf" | "crlf" | "cr" | "auto";
  filepath?: string;
  htmlWhitespaceSensitivity?: "css" | "strict" | "ignore";
  insertPragma?: boolean;
  jsxSingleQuote?: boolean;
  parser?:
    | "flow"
    | "babel"
    | "babel-flow"
    | "babel-ts"
    | "typescript"
    | "acorn"
    | "espree"
    | "meriyah"
    | "css"
    | "less"
    | "scss"
    | "json"
    | "json5"
    | "json-stringify"
    | "graphql"
    | "markdown"
    | "mdx"
    | "vue"
    | "yaml"
    | "glimmer"
    | "html"
    | "angular"
    | "lwc"
    | string;
  pluginSearchDirs?: string[] | false;
  plugins?: string[];
  printWidth?: number;
  proseWrap?: "always" | "never" | "preserve";
  quoteProps?: "as-needed" | "consistent" | "preserve";
  rangeEnd?: number;
  rangeStart?: number;
  requirePragma?: boolean;
  semi?: boolean;
  singleAttributePerLine?: boolean;
  singleQuote?: boolean;
  tabWidth?: number;
  trailingComma?: "es5" | "none" | "all";
  useTabs?: boolean;
  vueIndentScriptAndStyle?: boolean;
};

const PRETTIERRC_FILENAME = ".prettierrc.yml";

export async function readPrettierrc({ directory }: { directory: string }) {
  return readYaml<Prettierrc>({
    path: path.join(directory, PRETTIERRC_FILENAME),
  });
}

export async function writePrettierrc({
  directory,
  data,
}: {
  directory: string;
  data: Prettierrc;
}) {
  await writeYaml({ path: path.join(directory, PRETTIERRC_FILENAME), data });
}

export async function removePrettierrc({ directory }: { directory: string }) {
  await removeFile({ path: path.join(directory, PRETTIERRC_FILENAME) });
}
