import chalk from "chalk";
import ora from "ora";

type Log = {
  message: string;
  type: "debug" | "info" | "warning";
};

let messages: Log[];

function resetLog() {
  messages = [];
}

resetLog();

export function log(message: string, type: Log["type"] = "info") {
  messages.push({ message, type });
}

export function debug(message: string) {
  if (process.env["DEBUG"]) {
    log(message, "debug");
  }
}

export function info(message: string) {
  log(message, "info");
}

export function warning(message: string) {
  log(message, "warning");
}

export function writeInfo(message: string) {
  return console.log(chalk.blue(message));
}

export function writeDebug(message: string) {
  return console.debug(chalk.gray(message));
}

export function writeWarning(message: string) {
  return console.warn(chalk.bgYellow.black(message));
}

export function writeError(message: string) {
  return console.error(chalk.bgRed.white(message));
}

export async function flushLogs() {
  for (const { message, type } of messages) {
    type === "warning"
      ? writeWarning(message)
      : type === "debug"
      ? writeDebug(message)
      : writeInfo(message);
  }
  resetLog();
}

export async function task<T>(title: string, callback: () => Promise<T>) {
  const spinner = ora(title).start();
  let result: T;

  try {
    result = await callback();
  } catch (error) {
    spinner.fail();
    flushLogs();
    throw error;
  }

  if (messages.filter(({ type }) => type === "warning").length > 0) {
    spinner.warn();
  } else {
    spinner.succeed(title);
  }

  flushLogs();

  return result;
}
