import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { pkgUpSync as pkgUp } from "pkg-up";
import { LernaJson } from "./LernaJson.js";
import { Package } from "./Package.js";
import { PrettierRcJson } from "./PrettierRcJson.js";

export type CreateMonorepoOptions = {
  scoped: boolean;
  license: string;
  initialVersion: string;
  workspacesDirectory: string;
};

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

  public async create() {
    if (fs.existsSync(this.directory)) {
      throw new Error(`${this.directory} already exists`);
    }

    fs.mkdirSync(this.directory);

    execSync("git init", { cwd: this.directory });
  }
}
