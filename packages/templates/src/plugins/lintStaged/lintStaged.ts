import {
  enqueueDependency,
  exec,
  hasPlugin,
  PluginArgs,
  PluginType,
  writePackage,
} from "@mokr/core";

async function install({ directory }: PluginArgs) {
  await enqueueDependency({ directory, identifier: "lint-staged", dev: true });
}

async function refresh({ directory }: PluginArgs) {
  if (await hasPlugin({ directory, name: "prettier" })) {
    await writePackage({
      directory,
      data: {
        "lint-staged": {
          "*": "prettier --write --ignore-unknown",
        },
      },
    });
  }

  if (await hasPlugin({ directory, name: "husky" })) {
    await exec(
      "yarn",
      ["husky", "add", ".husky/pre-commit", '"yarn lint-staged"'],
      {
        cwd: directory,
      }
    );
  }
}

export const lintStaged = {
  type: PluginType.Monorepo,
  install,
  refresh,
};
