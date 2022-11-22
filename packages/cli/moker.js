#!/usr/bin/env node

import { writeError } from "@mokr/core";
import cli from "./dist/cli.js";

cli.runOrRepl().catch((err) => {
  if (process.env["DEBUG"]) {
    console.debug(err);
  } else {
    writeError(`\n${String(err)}`);
  }

  process.exit(1);
});
