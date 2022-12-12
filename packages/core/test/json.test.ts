import assert from "node:assert";
import { writeFileSync } from "node:fs";
import { temporaryFile } from "tempy";
import { readJson } from "../src/json.js";

export async function testReadJson() {
  const path = temporaryFile();
  writeFileSync(path, '{ "foo": "bar" }');

  assert.deepEqual(await readJson({ path }), { foo: "bar" });
}
