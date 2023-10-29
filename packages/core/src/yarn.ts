import { createDirectory } from "./directory.js";
import { writeGitignore } from "./gitignore.js";
import { sortPackage } from "./package.js";
import { exec } from "./utils/exec.js";
import { writeYarnrc } from "./yarnrc.js";

type DirOption = {
  directory: string;
};

const GITIGNORE_LINES = [
  "# node",
  "node_modules",
  "",
  "# yarn",
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

export async function runYarnCmd(
  args: string[],
  { directory }: { directory: string },
) {
  return exec("yarn", args, {
    cwd: directory,
    env: {
      ...process.env,
      // Reset NODE_OPTIONS='--loader=ts-node/esm' when running from tests
      NODE_OPTIONS: undefined,
    },
  });
}

export async function initYarnExistingRepo({ directory }: DirOption) {
  await exec("git", ["init", "--initial-branch", "main"], { cwd: directory });

  await runYarnCmd(["set", "version", "latest"], { directory });

  await setupYarn({ directory });
}

export async function initYarnNewRepo({ directory }: DirOption) {
  await createDirectory({ directory });

  await runYarnCmd(["init", "-2"], { directory });

  await setupYarn({ directory });
}

async function setupYarn({ directory }: DirOption) {
  await writeYarnrc({
    directory,
    data: { nodeLinker: "node-modules", npmPublishAccess: "public" },
  });

  await writeGitignore({ directory, lines: GITIGNORE_LINES, append: false });

  await addYarnPlugin({ directory, name: "interactive-tools" });
}

export async function addYarnPlugin({
  directory,
  name,
}: {
  directory: string;
  name: string;
}) {
  const currentPlugins = await getYarnPlugins({ directory });

  if (!currentPlugins.includes(name)) {
    await runYarnCmd(["plugin", "import", name], { directory });
  }
}

export async function removeYarnPlugin({
  directory,
  name,
}: {
  directory: string;
  name: string;
}) {
  await runYarnCmd(["plugin", "remove", name], { directory });
}

export async function getYarnPlugins({ directory }: { directory: string }) {
  const { stdout } = await runYarnCmd(["plugin", "runtime", "--json"], {
    directory,
  });

  return stdout.split("\n").reduce((acc, line) => {
    try {
      const { name } = JSON.parse(line);

      if (name !== "@@core") {
        return [...acc, name.replace("@yarnpkg/plugin-", "")];
      }
    } catch {
      // ignore
    }

    return acc;
  }, [] as string[]);
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

  await runYarnCmd(installArgs, { directory });
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
  queue: (typeof queues)[keyof typeof queues];
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
    await runYarnCmd([], { directory });
    return;
  }

  if (dependencies.size) {
    const installArgs = ["add", "--exact", ...Array.from(dependencies)];

    await runYarnCmd(installArgs, { directory });

    queues.install.set(directory, new Set());
  }

  if (devDependencies.size) {
    const installArgs = [
      "add",
      "--exact",
      "--dev",
      ...Array.from(devDependencies),
    ];

    await runYarnCmd(installArgs, { directory });

    queues.installDev.set(directory, new Set());
  }

  if (removeDependencies.size) {
    const removeArgs = ["remove", ...Array.from(removeDependencies)];

    await runYarnCmd(removeArgs, { directory });

    queues.remove.set(directory, new Set());
  }

  await sortPackage({ directory });
}

export async function getWorkspaces({ directory }: DirOption) {
  const { stdout } = await runYarnCmd(["workspaces", "list", "--json"], {
    directory,
  });
  const workspaces: { location: string; name: string }[] = [];

  for (const line of stdout.split("\n").filter((item) => item)) {
    workspaces.push(JSON.parse(line.trim()));
  }

  return workspaces;
}
