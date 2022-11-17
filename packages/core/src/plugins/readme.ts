import { Package, TextFile } from "../index.js";

export async function readme(pkg: Package) {
  new TextFile(pkg.directory, "README.md").text = `# ${pkg.name}`;
}
