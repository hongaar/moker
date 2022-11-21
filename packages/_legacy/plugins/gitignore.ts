import { Monorepo } from "../index.js";

export const DEFAULT_GITIGNORE = ["node_modules/", "lib/"];

export async function gitignore(monorepo: Monorepo, extra: string[] = []) {
  monorepo.gitignore.contents = [...DEFAULT_GITIGNORE, ...extra];
}
