import assert from "node:assert";
import test from "test";
import { hasEncounteredErrors, resetState, task } from "../src/io.js";

/* @ts-expect-error */
const { beforeEach, describe, it } = test;

describe("task", () => {
  beforeEach(() => resetState());

  it("should return the task result", async () => {
    const testTask = async () => {
      return "foo";
    };

    assert.deepStrictEqual(await task("Test task", testTask), ["foo", null]);
  });

  it("should not throw when a task is failing", async () => {
    const error = new Error();
    const failingTask = async () => {
      throw error;
    };

    assert.deepStrictEqual(await task("Failing task", failingTask), [
      null,
      error,
    ]);
  });
});

describe("hasEncounteredErrors", () => {
  beforeEach(() => resetState());

  it("should return false if no error occurs", async () => {
    await task("Test task", async () => {
      return "foo";
    });

    assert(!hasEncounteredErrors());
  });

  it("should return true if an error occurs", async () => {
    await task("Failing task", async () => {
      throw new Error();
    });

    assert(hasEncounteredErrors());
  });
});
