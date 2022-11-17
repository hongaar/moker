import { assertNodeVersion, assertYarnVersion } from "@mokr/core";
import { program } from "bandersnatch";
import * as commands from "./commands/index.js";

const mokr = program().prompt("mokr > ");

// @ts-ignore
Object.values(commands).forEach((command) => mokr.add(command));

// Some assertions we always need
assertYarnVersion(3);
assertNodeVersion(16);

export default mokr;
