import { PluginType } from "@mokr/core";

async function install() {
  // jest -> test workflow
  // semanticRelease -> release workflow
  // prettier -> lint workflow
  // typescript -> build workflow
}

async function remove() {}

async function load() {}

export const githubActions = {
  type: PluginType.Monorepo,
  install,
  remove,
  load,
};
