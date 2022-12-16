import { exec } from "./exec.js";

export async function assertYarnVersion(version: number) {
  let execResult: Awaited<ReturnType<typeof exec>>;

  try {
    execResult = await exec("yarn --version");
  } catch (error) {
    throw new Error("Yarn is not installed.");
  }

  if (parseInt(execResult.stdout, 10) < version) {
    throw new Error(`Needs at least Yarn v${version} to run moker.`);
  }
}

export async function assertNodeVersion(version: number) {
  if (parseInt(process.versions.node, 10) < version) {
    throw new Error(`Needs at least Node v${version} to run moker.`);
  }
}
