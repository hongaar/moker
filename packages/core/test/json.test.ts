import assert from "node:assert";
import { writeFileSync } from "node:fs";
import { temporaryFile } from "tempy";
import { describe, it } from "test";
import { readJson } from "../src/json.js";

describe("readJson", () => {
  it("should read a JSON file", async () => {
    const path = temporaryFile();
    writeFileSync(path, '{ "foo": "bar" }');

    assert.deepEqual(await readJson({ path }), { foo: "bar" });
  });
});
