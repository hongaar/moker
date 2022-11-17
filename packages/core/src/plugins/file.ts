import { Package, TextFile } from "../index.js";

export async function file(pkg: Package, filename: string, contents: string) {
  new TextFile(pkg.directory, filename).text = contents;
}
