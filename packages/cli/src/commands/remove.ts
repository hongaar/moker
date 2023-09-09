import { command } from "bandersnatch";
import * as commands from "./remove/index.js";

export const remove = command("remove").description(
  "Remove plugins or workspaces",
);

Object.values(commands).forEach((command) => remove.add(command));
