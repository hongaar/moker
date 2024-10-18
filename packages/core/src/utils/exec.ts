import childProcess, { ChildProcess } from "node:child_process";
import { debug, getLastTask } from "../io.js";

function childAwaiter(child: ChildProcess): Promise<number> {
  return new Promise(function (resolve, reject) {
    child.on("error", reject);
    child.on("exit", resolve);
  });
}

export async function exec(
  cmd: string,
  args: string[] = [],
  {
    cwd = process.cwd(),
    env = process.env,
    io = "return" as "return" | "passthrough",
  } = {},
) {
  debug(`spawning "${cmd} ${args.join(" ")}" in "${cwd}"`);

  if (io === "passthrough") {
    getLastTask()?.stop();
  }

  const child = childProcess.spawn(cmd, args, {
    shell: true,
    stdio: io === "passthrough" ? "inherit" : "pipe",
    cwd,
    env,
  });

  let stdout = "";
  let stderr = "";

  if (child.stdout) {
    child.stdout.on("data", function (chunk) {
      stdout += chunk;
    });
  }

  if (child.stderr) {
    child.stderr.on("data", function (chunk) {
      stdout += chunk;
    });
  }

  const status = await childAwaiter(child);

  if (io === "passthrough") {
    getLastTask()?.start();
  }

  const result = { status, stdout, stderr };

  if (status !== 0) {
    const error = new Error(
      `exec [${cmd}] returned with an error - ${JSON.stringify(result)}`,
    );
    Object.assign(error, result);

    throw error;
  }

  return result;
}
