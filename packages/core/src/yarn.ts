import { createDirectory } from "./directory.js";
import { writeGitignore } from "./gitignore.js";
import { exec } from "./utils/exec.js";
import { writeYarnrc } from "./yarnrc.js";

type DirOption = {
  directory: string;
};

const GITIGNORE_LINES = [
  ".pnp.*",
  ".yarn/*",
  "!.yarn/patches",
  "!.yarn/plugins",
  "!.yarn/releases",
  "!.yarn/sdks",
  "!.yarn/versions",
];

const DEFAULT_DEPENDENCY_QUEUE = {
  dependencies: new Set<string>(),
  devDependencies: new Set<string>(),
};

let dependencyInstallQueue = new Map<string, typeof DEFAULT_DEPENDENCY_QUEUE>();
let dependencyRemoveQueue = new Map<
  string,
  typeof DEFAULT_DEPENDENCY_QUEUE["dependencies"]
>();

export async function initYarn({ directory }: DirOption) {
  await createDirectory({ directory });
  await exec("yarn", ["init"], { cwd: directory });
  await writeYarnrc({ directory, data: { nodeLinker: "node-modules" } });
  await writeGitignore({ directory, lines: GITIGNORE_LINES, append: false });
  await addYarnPlugin({ directory, name: "interactive-tools" });
  await addYarnPlugin({ directory, name: "workspace-tools" });

  // yarn plugin import typescript
}

export async function addYarnPlugin({
  directory,
  name,
}: {
  directory: string;
  name: string;
}) {
  await exec("yarn", ["plugin", "import", name], { cwd: directory });
}

export async function installDependency({
  directory,
  identifier,
  dev = false,
}: {
  directory: string;
  identifier: string;
  dev?: boolean;
}) {
  const installArgs = ["add", "--exact", ...(dev ? ["--dev"] : []), identifier];

  await exec("yarn", installArgs, { cwd: directory });
}

export async function enqueueInstallDependency({
  directory,
  identifier,
  dev = false,
}: {
  directory: string;
  identifier: string;
  dev?: boolean;
}) {
  if (!dependencyInstallQueue.has(directory)) {
    dependencyInstallQueue.set(directory, DEFAULT_DEPENDENCY_QUEUE);
  }
  dependencyInstallQueue
    .get(directory)!
    [dev ? "devDependencies" : "dependencies"].add(identifier);
}

export async function enqueueRemoveDependency({
  directory,
  identifier,
}: {
  directory: string;
  identifier: string;
}) {
  if (!dependencyRemoveQueue.has(directory)) {
    dependencyRemoveQueue.set(
      directory,
      DEFAULT_DEPENDENCY_QUEUE["dependencies"]
    );
  }
  dependencyRemoveQueue.get(directory)!.add(identifier);
}

export async function runDependencyQueues({ directory }: DirOption) {
  const { dependencies, devDependencies } =
    dependencyInstallQueue.get(directory) || DEFAULT_DEPENDENCY_QUEUE;
  const removeDependencies =
    dependencyRemoveQueue.get(directory) ||
    DEFAULT_DEPENDENCY_QUEUE["dependencies"];
  const installArgs = [
    "add",
    "--exact",
    ...Array.from(dependencies),
    ...Array.from(devDependencies).map((dependency) => `--dev ${dependency}`),
  ];
  const removeArgs = ["remove", ...Array.from(removeDependencies)];

  if (installArgs.length === 1 && removeArgs.length === 1) {
    // Nothing to install or remove
    await exec("yarn", [], { cwd: directory });
  }

  // Reset queues for directory
  dependencyInstallQueue.set(directory, DEFAULT_DEPENDENCY_QUEUE);
  dependencyRemoveQueue.set(
    directory,
    DEFAULT_DEPENDENCY_QUEUE["dependencies"]
  );

  // Install packages
  if (installArgs.length > 1) {
    await exec("yarn", installArgs, { cwd: directory });
  }

  // Remove packages
  if (removeArgs.length > 1) {
    await exec("yarn", removeArgs, { cwd: directory });
  }
}
