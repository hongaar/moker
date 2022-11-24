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

const queues = {
  install: new Map<string, Set<string>>(),
  installDev: new Map<string, Set<string>>(),
  remove: new Map<string, Set<string>>(),
};

export async function initYarn({ directory }: DirOption) {
  await createDirectory({ directory });

  await exec("yarn", ["init", "-2"], { cwd: directory });

  await writeYarnrc({ directory, data: { nodeLinker: "node-modules" } });

  await writeGitignore({ directory, lines: GITIGNORE_LINES, append: false });

  await addYarnPlugin({ directory, name: "interactive-tools" });

  await addYarnPlugin({ directory, name: "workspace-tools" });
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

export async function removeYarnPlugin({
  directory,
  name,
}: {
  directory: string;
  name: string;
}) {
  await exec("yarn", ["plugin", "remove", name], { cwd: directory });
}

export async function installDependency({
  directory,
  identifier,
  dev = false,
}: {
  directory: string;
  identifier: string | string[];
  dev?: boolean;
}) {
  identifier = Array.isArray(identifier) ? identifier : [identifier];

  const installArgs = [
    "add",
    "--exact",
    ...identifier.map((id) => (dev ? `--dev ${id}` : id)),
  ];

  await exec("yarn", installArgs, { cwd: directory });
}

export function enqueueInstallDependency({
  directory,
  identifier,
  dev = false,
}: {
  directory: string;
  identifier: string | string[];
  dev?: boolean;
}) {
  enqueue({
    queue: dev ? queues.installDev : queues.install,
    directory,
    identifier,
  });
}

export function enqueueRemoveDependency({
  directory,
  identifier,
}: {
  directory: string;
  identifier: string | string[];
}) {
  enqueue({
    queue: queues.remove,
    directory,
    identifier,
  });
}

type EnqueueOptions = {
  queue: typeof queues[keyof typeof queues];
  directory: string;
  identifier: string | string[];
};

function enqueue({ queue, directory, identifier }: EnqueueOptions) {
  if (!queue.has(directory)) {
    queue.set(directory, new Set());
  }

  identifier = Array.isArray(identifier) ? identifier : [identifier];

  for (const id of identifier) {
    queue.get(directory)!.add(id);
  }
}

export async function runDependencyQueues({ directory }: DirOption) {
  const dependencies = queues.install.get(directory) || new Set();
  const devDependencies = queues.installDev.get(directory) || new Set();
  const removeDependencies = queues.remove.get(directory) || new Set();

  if (!dependencies.size && !devDependencies.size && !removeDependencies.size) {
    // Nothing to install or remove
    await exec("yarn", [], { cwd: directory });
    return;
  }

  if (dependencies.size || devDependencies.size) {
    const installArgs = [
      "add",
      "--exact",
      ...Array.from(dependencies),
      ...Array.from(devDependencies).map((dependency) => `--dev ${dependency}`),
    ];

    await exec("yarn", installArgs, { cwd: directory });

    queues.install.set(directory, new Set());
    queues.installDev.set(directory, new Set());
  }

  if (removeDependencies.size) {
    const removeArgs = ["remove", ...Array.from(removeDependencies)];

    await exec("yarn", removeArgs, { cwd: directory });

    queues.remove.set(directory, new Set());
  }
}
