import {
  enqueueInstallDependency,
  installPlugin,
  PluginType,
  TemplateArgs,
  writeFile,
  writePackage,
} from "@mokr/core";
import { basename, join } from "node:path";

async function apply({ directory }: TemplateArgs) {
  await installPlugin({ directory, name: "typescript" });
  await installPlugin({ directory, name: "jest" });

  enqueueInstallDependency({ directory, identifier: "express" });

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
    path: join(directory, "src/app.ts"),
    contents: `
import express from "express";

export const app = express();

app.get("/", (_req, res) => {
  res.send("Hello, world!");
});

`,
  });

  await writeFile({
    path: join(directory, bin),
    contents: `
#!/usr/bin/env node

import { app } from "./dist/app.js";

app.listen(process.env.PORT || 3000);
`,
  });
}

export const express = {
  type: PluginType.Workspace,
  apply,
};
