#!/usr/bin/env node

import { writeError } from "@mokr/core";
import mokr from "./dist/program.js";

mokr.runOrRepl().catch((err) => {
  writeError(`\n${String(err)}`);
  process.exit(1);
});
