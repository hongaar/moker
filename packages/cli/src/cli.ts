import { assertNodeVersion, assertYarnVersion } from "@mokr/core";
import { program } from "bandersnatch";
import * as commands from "./commands/index.js";

const cli = program().prompt("moker > ");

// @ts-ignore
Object.values(commands).forEach((command) => cli.add(command));

// Some assertions we always need
assertYarnVersion(3);
assertNodeVersion(16);

export default cli;
