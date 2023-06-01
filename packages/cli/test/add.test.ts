import { createDirectory, isDirectory, writePackage } from "@mokr/core";
import assert from "node:assert";
import { temporaryDirectory } from "tempy";
import test from "test";
import cli from "../src/cli.js";

/* @ts-expect-error */
const { describe, beforeEach, it } = test;

describe("add", () => {
  let tempDir: string;

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
        name: "foo",
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
          name: "foo",
          workspaces: ["packages/*"],
          moker: { scoped: true },
        },
      });

      await cli.run(`add --cwd ${tempDir} --template bar foo`);
      assert(await isDirectory({ directory: `${tempDir}/packages/foo` }));
    }
  });
});
