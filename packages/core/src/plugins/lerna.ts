import { Monorepo } from "../index.js";

type LernaOptions = {
  version?: string;
  workspaces?: string[];
};

export async function lerna(monorepo: Monorepo, options: LernaOptions = {}) {
  monorepo.lernaJson.contents = {
    version: options.version,
    packages: options.workspaces,
    npmClient: "yarn",
    useWorkspaces: true,
  };

  monorepo.addDevDependency("lerna");
}
