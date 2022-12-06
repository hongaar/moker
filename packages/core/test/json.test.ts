import { readJson } from "../src/json.js";

jest.mock("../src/file.js", () => ({
  readFile: jest.fn(() => Promise.resolve('{ "foo": "bar" }')),
}));

test("readJson", async () => {
  await expect(readJson({ path: "test" })).resolves.toEqual({ foo: "bar" });
});
