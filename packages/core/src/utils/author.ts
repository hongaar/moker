import { exec } from "./exec.js";

export async function getAuthor() {
  const name = (await exec("git", ["config", "user.name"])).stdout.trim();
  const email = (await exec("git", ["config", "user.email"])).stdout.trim();

  return { name, email };
}

export function getUsername() {
  const { env } = process;

  return (
    env["SUDO_USER"] ||
    env["LOGNAME"] ||
    env["USER"] ||
    env["LNAME"] ||
    env["USERNAME"]
  );
}
