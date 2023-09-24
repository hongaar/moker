import assert from "node:assert";
import { writeFileSync } from "node:fs";
import { describe, it } from "node:test";
import { temporaryFile } from "tempy";
import { readJson } from "../src/json.js";

describe("readJson", () => {
  it("should read a JSON file", async () => {
    const path = temporaryFile();
    writeFileSync(path, '{ "foo": "bar" }');

    assert.deepEqual(await readJson({ path }), { foo: "bar" });
  });
});
