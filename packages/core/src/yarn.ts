import { writeGitignore } from "./gitignore.js";
import { exec } from "./utils/exec.js";
import { writeYarnrc } from "./yarnrc.js";

type InitYarnOptions = {
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

let dependencyQueue = new Map<string, typeof DEFAULT_DEPENDENCY_QUEUE>();

export async function initYarn({ directory }: InitYarnOptions) {
  await exec("yarn", ["init", "-2"], { cwd: directory });
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

export async function enqueueDependency({
  directory,
  identifier,
  dev = false,
}: {
  directory: string;
  identifier: string;
  dev?: boolean;
}) {
  if (!dependencyQueue.has(directory)) {
    dependencyQueue.set(directory, DEFAULT_DEPENDENCY_QUEUE);
  }
  dependencyQueue
    .get(directory)!
    [dev ? "devDependencies" : "dependencies"].add(identifier);
}

export async function installEnqueuedDependencies({
  directory,
}: InitYarnOptions) {
  const { dependencies, devDependencies } =
    dependencyQueue.get(directory) || DEFAULT_DEPENDENCY_QUEUE;
  const args = [
    "add",
    ...Array.from(dependencies),
    ...Array.from(devDependencies).map((dependency) => `--dev ${dependency}`),
  ];

  if (args.length === 1) {
    // Nothing to install
    return exec("yarn", [], { cwd: directory });
  }

  // Reset queue for directory
  dependencyQueue.set(directory, DEFAULT_DEPENDENCY_QUEUE);

  // Install packages
  return exec("yarn", args, { cwd: directory });
}
