#!/usr/bin/env node

import { writeError } from "@mokr/core";
import mokr from "./dist/program.js";

mokr.runOrRepl().catch((err) => {
  if (process.env["DEBUG"]) {
    console.debug(err);
  } else {
    writeError(`\n${String(err)}`);
  }

  process.exit(1);
});
