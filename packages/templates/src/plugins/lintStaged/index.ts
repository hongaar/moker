import {
  enqueueDependency,
  exec,
  hasPlugin,
  PluginArgs,
  PluginLevel,
  writePackage,
} from "@mokr/core";

async function lintStaged({ directory }: PluginArgs) {
  await enqueueDependency({ directory, identifier: "lint-staged", dev: true });

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

lintStaged.level = PluginLevel.Monorepo;

export { lintStaged };
