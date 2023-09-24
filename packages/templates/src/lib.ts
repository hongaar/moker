import {
  PluginType,
  installPlugin,
  writeFile,
  type TemplateArgs,
} from "@mokr/core";
import { join } from "path";

async function apply({ directory }: TemplateArgs) {
  await installPlugin({ directory, name: "typescript" });
  await installPlugin({ directory, name: "test" });

  await writeFile({
    path: join(directory, "src/sum.ts"),
    contents: `
export function sum(a: number, b: number) {
  return a + b;
}
`,
  });

  await writeFile({
    path: join(directory, "src/index.ts"),
    contents: `export * from "./sum.js";`,
  });

  await writeFile({
    path: join(directory, "test/sum.test.ts"),
    contents: `
import assert from "node:assert";
import test from "node:test";
import { sum } from "../src/sum.js";

test("adds 1 + 2 to equal 3", () => {
  assert.strictEqual(sum(1, 2), 3);
});
`,
  });
}

export const lib = {
  type: PluginType.RepoOrWorkspace,
  apply,
};
