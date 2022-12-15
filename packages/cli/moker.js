#!/usr/bin/env node

import { hasEncounteredErrors, writeError } from "@mokr/core";
import cli from "./dist/cli.js";

function errorHandler(err) {
  writeError(err);
  process.exit(1);
}

// Compat layer for Node < 16
process.on("unhandledRejection", errorHandler);

// Run application
await cli.runOrRepl().catch(errorHandler);

// If tasks had errors, exit with non-zero code
if (hasEncounteredErrors()) {
  process.exit(1);
}
