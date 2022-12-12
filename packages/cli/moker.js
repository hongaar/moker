#!/usr/bin/env node

import { writeError } from "@mokr/core";
import cli from "./dist/cli.js";

function errorHandler(err) {
  if (process.env["DEBUG"]) {
    console.debug(err);
  } else {
    writeError(`\n${String(err)}`);
  }

  process.exit(1);
}

cli.runOrRepl().catch(errorHandler);

// Compat layer for Node < 16
process.on("unhandledRejection", errorHandler);
