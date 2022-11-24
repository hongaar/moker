import {
  enqueueInstallDependency,
  installPlugin,
  TemplateArgs,
  TemplateType,
  writeFile,
  writePackage,
} from "@mokr/core";
import { basename, join } from "node:path";

async function apply({ directory }: TemplateArgs) {
  await installPlugin({ directory, name: "typescript" });
  await installPlugin({ directory, name: "jest" });

  enqueueInstallDependency({ directory, identifier: "bandersnatch" });

  const bin = `${basename(directory)}.js`;

  await writePackage({
    directory,
    data: {
      bin,
      files: [bin],
      scripts: {
        start: `node ${bin}`,
      },
    },
  });

  await writeFile({
    path: join(directory, "src/cli.ts"),
    contents: `
import { command, program } from "bandersnatch";

export const cli = program().default(
  command().action(() => {
    console.log("Hello, world!");
  })
);
`,
  });

  await writeFile({
    path: join(directory, bin),
    contents: `
#!/usr/bin/env node

import { cli } from "./dist/cli.js";

cli.run().catch(console.error);
`,
  });
}

export const bandersnatch = {
  type: TemplateType.Workspace,
  apply,
};
