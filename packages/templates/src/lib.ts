import {
  installPlugin,
  TemplateArgs,
  TemplateType,
  writeFile,
} from "@mokr/core";
import { join } from "path";

async function apply({ directory }: TemplateArgs) {
  await installPlugin({ directory, name: "typescript" });
  await installPlugin({ directory, name: "jest" });

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
    path: join(directory, "tests/sum.test.ts"),
    contents: `
import { sum } from "../src/sum.js";

test("adds 1 + 2 to equal 3", () => {
  expect(sum(1, 2)).toBe(3);
});
`,
  });
}

export const lib = {
  type: TemplateType.Workspace,
  apply,
};
