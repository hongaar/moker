import chalk from "chalk";
import ora, { type Ora } from "ora";

type Log =
  | {
      message: string;
      type: "debug" | "info" | "warning";
    }
  | {
      message: string | Error;
      type: "error";
    };

let tasks: Ora[] = [];
let messages: Log[];
let encounteredErrors: boolean;

resetState();

export function log(
  message: string,
  type: "debug" | "info" | "warning" = "info",
) {
  messages.push({ message, type });
}

export function logError(error: string | Error) {
  messages.push({ message: error, type: "error" });
  encounteredErrors = true;
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

export function writeError(err: string | Error) {
  if (process.env["DEBUG"]) {
    console.debug(err);
  } else {
    console.error(chalk.bgRed.white(String(err)));
  }
}

export function resetMessages() {
  messages = [];
}

export function resetEncounteredErrors() {
  encounteredErrors = false;
}

export function resetState() {
  resetMessages();
  resetEncounteredErrors();
}

export async function flushLogs() {
  for (const { message, type } of messages) {
    type === "warning"
      ? writeWarning(message)
      : type === "debug"
        ? writeDebug(message)
        : type === "error"
          ? writeError(message)
          : writeInfo(message);
  }
  resetMessages();
}

export async function task<T>(
  title: string,
  callback: (spinner: Ora) => Promise<T>,
) {
  const spinner = ora(title).start();
  let result: T | null = null;
  let error: any;

  tasks.push(spinner);

  try {
    result = await callback(spinner);
  } catch (err: any) {
    error = error;
    logError(err);
  }

  if (error) {
    spinner.fail();
  } else if (messages.filter(({ type }) => type === "warning").length > 0) {
    spinner.warn();
  } else {
    spinner.succeed();
  }

  flushLogs();
  tasks = tasks.filter((task) => task !== spinner);

  return [
    error ? null : (result as T),
    error ? (error as Error) : null,
  ] as const;
}

export function getMessages() {
  return messages;
}

export function containsMessage(search: string) {
  return messages.some(({ message }) => String(message) === search);
}

export function hasEncounteredErrors() {
  return encounteredErrors;
}

export function getLastTask() {
  return tasks[tasks.length - 1];
}
