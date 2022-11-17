#!/usr/bin/env node

import chalk from "chalk";
import mokr from "./dist/program.js";

function warning(text) {
  return chalk.bgRed.white(text);
}

mokr.runOrRepl().catch((err) => {
  console.error(warning(`\n${String(err)}`));
  process.exit(1);
});
