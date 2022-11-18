import { JsonFile } from "./JsonFile.js";

class PrettierRcSchema {
  /**
   * Include parentheses around a sole arrow function parameter.
   */
  public arrowParens?: "always" | "avoid";
  /**
   * Print spaces between brackets.
   */
  public bracketSpacing?: boolean;
  /**
   * Print (to stderr) where a cursor at the given position would move to after formatting.
   * This option cannot be used with --range-start and --range-end.
   */
  public cursorOffset?: number;
  /**
   * Control how Prettier formats quoted code embedded in the file.
   */
  public embeddedLanguageFormatting?: "auto" | "off";
  /**
   * Which end of line characters to apply.
   */
  public endOfLine?: "lf" | "crlf" | "cr" | "auto";
  /**
   * Specify the input filepath. This will be used to do parser inference.
   */
  public filepath?: string;
  /**
   * How to handle whitespaces in HTML.
   */
  public htmlWhitespaceSensitivity?: "css" | "strict" | "ignore";
  /**
   * Insert @format pragma into file's first docblock comment.
   */
  public insertPragma?: boolean;
  /**
   * Put > on the last line instead of at a new line.
   */
  public jsxBracketSameLine?: boolean;
  /**
   * Use single quotes in JSX.
   */
  public jsxSingleQuote?: boolean;
  /**
   * Which parser to use.
   */
  public parser?:
    | "flow"
    | "babel"
    | "babel-flow"
    | "babel-ts"
    | "typescript"
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
    | "html"
    | "angular"
    | "lwc";
  /**
   * Custom directory that contains prettier plugins in node_modules subdirectory.
   * Overrides default behavior when plugins are searched relatively to the location of Prettier.
   * Multiple values are accepted.
   */
  public pluginSearchDirs?: string[];
  /**
   * Add a plugin. Multiple plugins can be passed as separate `--plugin`s.
   */
  public plugins?: string[];
  /**
   * The line length where Prettier will try wrap.
   */
  public printWidth?: number;
  /**
   * How to wrap prose.
   */
  public proseWrap?: "always" | "never" | "preserve";
  /**
   * Change when properties in objects are quoted.
   */
  public quoteProps?: "as-needed" | "consistent" | "preserve";
  /**
   * Format code ending at a given character offset (exclusive).
   * The range will extend forwards to the end of the selected statement.
   * This option cannot be used with --cursor-offset.
   */
  public rangeEnd?: number;
  /**
   * Format code starting at a given character offset.
   * The range will extend backwards to the start of the first line containing the selected statement.
   * This option cannot be used with --cursor-offset.
   */
  public rangeStart?: number;
  /**
   * Require either '@prettier' or '@format' to be present in the file's first docblock comment
   * in order for it to be formatted.
   */
  public requirePragma?: boolean;
  /**
   * Print semicolons.
   */
  public semi?: boolean;
  /**
   * Use single quotes instead of double quotes.
   */
  public singleQuote?: boolean;
  /**
   * Number of spaces per indentation level.
   */
  public tabWidth?: number;
  /**
   * Print trailing commas wherever possible when multi-line.
   */
  public trailingComma?: "es5" | "none" | "all";
  /**
   * Indent with tabs instead of spaces.
   */
  public useTabs?: boolean;
  /**
   * Indent script and style tags in Vue files.
   */
  public vueIndentScriptAndStyle?: boolean;

  constructor(object: PrettierRcSchema) {
    Object.assign(this, object);
  }
}

export class PrettierRcJson extends JsonFile<PrettierRcSchema> {
  constructor(public directory: string) {
    super(directory, ".prettierrc.json", PrettierRcSchema);
  }
}
