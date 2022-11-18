import childProcess, { ChildProcess } from "node:child_process";

type Options = {
  cwd: string;
  env: {};
  io?: "return" | "passthrough";
};

function childAwaiter(child: ChildProcess): Promise<number> {
  return new Promise(function (resolve, reject) {
    child.on("error", reject);
    child.on("exit", resolve);
  });
}

export async function exec(
  cmd: string,
  args: string[] = [],
  { cwd, env, io }: Options = { cwd: process.cwd(), env: process.env }
) {
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

  const result = { status, stdout, stderr };

  if (status !== 0) {
    const error = new Error(
      `exec [${cmd}] returned with an error - ${JSON.stringify(result)}`
    );
    Object.assign(error, result);

    throw error;
  }

  return result;
}
