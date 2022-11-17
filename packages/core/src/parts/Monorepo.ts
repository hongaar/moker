import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { pkgUpSync as pkgUp } from "pkg-up";
import { Plugins, plugins } from "../index.js";
import { LernaJson } from "./LernaJson.js";
import { Package } from "./Package.js";
import { PrettierRcJson } from "./PrettierRcJson.js";

export const DEFAULT_LICENSE = "MIT";
export const DEFAULT_INITIAL_VERSION = "0.0.0";
export const DEFAULT_WORKSPACES_DIRECTORY = "packages";

const defaultOptions = {
  scoped: false,
  license: DEFAULT_LICENSE,
  initialVersion: DEFAULT_INITIAL_VERSION,
  workspacesDirectory: DEFAULT_WORKSPACES_DIRECTORY,
};

export type CreateMonorepoOptions = {
  scoped: boolean;
  license: string;
  initialVersion: string;
  workspacesDirectory: string;
};

type MonorepoTemplate = (
  monorepo: Monorepo,
  options: CreateMonorepoOptions,
  plugins: Plugins
) => Promise<void>;

export class Monorepo extends Package {
  public static find(directory: string): undefined | Monorepo {
    const root = pkgUp({ cwd: directory });

    if (root) {
      const pkg = new Package(path.dirname(root));

      if (!pkg.isRoot()) {
        // Not a root monorepo, proceed to parent directory
        return Monorepo.find(path.dirname(path.dirname(root)));
      }

      return new Monorepo(path.dirname(root));
    }
  }

  public get scoped() {
    return !!this.packageJson.contents.mokr?.scoped;
  }

  public get lernaJson() {
    return new LernaJson(this.directory);
  }

  public get prettierRcJson() {
    return new PrettierRcJson(this.directory);
  }

  public async create(
    templateFn: MonorepoTemplate,
    options: Partial<CreateMonorepoOptions> = {}
  ) {
    if (fs.existsSync(this.directory)) {
      throw new Error(`${this.directory} already exists`);
    }

    fs.mkdirSync(this.directory);

    execSync("git init", { cwd: this.directory });

    const optionsWithDefaults = Object.assign({}, defaultOptions, options);

    await templateFn(this, optionsWithDefaults, plugins);
  }
}
