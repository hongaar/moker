import assert from "node:assert";
import { writeFileSync } from "node:fs";
import { temporaryFile } from "tempy";
import test from "test";
import { readJson } from "../src/json.js";

/* @ts-expect-error */
const { describe, it } = test;

describe("readJson", () => {
  it("should read a JSON file", async () => {
    const path = temporaryFile();
    writeFileSync(path, '{ "foo": "bar" }');

    assert.deepEqual(await readJson({ path }), { foo: "bar" });
  });
});
