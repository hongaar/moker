import { createDirectory, isDirectory, writePackage } from "@mokr/core";
import { setFastFail } from "@mokr/core/src/io.js";
import assert from "node:assert";
import { temporaryDirectory } from "tempy";
import test from "test";
import cli from "../src/cli.js";

/* @ts-expect-error */
const { beforeEach, before, after, it } = test;

let tempDir: string;

before(() => {
  setFastFail(true);
});

after(() => {
  setFastFail(false);
});

beforeEach(() => {
  tempDir = temporaryDirectory();
});

it("should only run within monorepos", async () => {
  await assert.rejects(cli.run(`add --cwd ${tempDir} foo`), {
    name: "Error",
    message: "Execute this command from within a monorepo",
  });
});

it("needs a workspace configuration", async () => {
  await createDirectory({ directory: `${tempDir}/.git` });
  await writePackage({
    directory: tempDir,
    data: {
      moker: { scoped: true },
    },
  });

  await assert.rejects(cli.run(`add --cwd ${tempDir} foo`), {
    name: "Error",
    message: "No workspace configuration found in package.json",
  });
});

it("should add a workspace", async () => {
  await createDirectory({ directory: `${tempDir}/.git` });
  await writePackage({
    directory: tempDir,
    data: {
      workspaces: ["packages/*"],
      moker: { scoped: true },
    },
  });

  await cli.run(`add --cwd ${tempDir} foo`);
});

it("should not confuse templates and workspace names", async () => {
  /**
   * @todo: remove when https://github.com/nodejs/node/issues/47614 resolves
   */

  if (!process.versions.node.startsWith("20.")) {
    await createDirectory({ directory: `${tempDir}/.git` });
    await writePackage({
      directory: tempDir,
      data: {
        workspaces: ["packages/*"],
        moker: { scoped: true },
      },
    });

    await cli.run(`add --cwd ${tempDir} --template bar foo`);
    assert(await isDirectory({ directory: `${tempDir}/packages/foo` }));
  }
});
