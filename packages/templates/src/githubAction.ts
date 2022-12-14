import {
  enqueueInstallDependency,
  hasPlugin,
  installPlugin,
  PluginType,
  TemplateArgs,
  warning,
  writeFile,
  writePackage,
  writeYaml,
} from "@mokr/core";
import { basename, join, resolve } from "node:path";

async function apply({ directory }: TemplateArgs) {
  const name = basename(directory);
  const description = `Description of ${name} action`;

  await installPlugin({ directory, name: "typescript" });

  await installPlugin({ directory, name: "esbuild" });

  // We need to bundle to cjs due to some dependencies not supporting esm
  // See https://github.com/evanw/esbuild/issues/1921
  await writePackage({
    directory,
    data: {
      scripts: {
        "build:bundle":
          "esbuild --bundle --platform=node --format=cjs --target=es2022 --outfile=dist/index.cjs src/index.ts",
      },
    },
  });

  // But Git should ignore generated files
  await writeFile({
    path: resolve(directory, ".gitattributes"),
    contents: `*.js linguist-generated=true`,
  });

  // Required action.yml
  await writeYaml({
    path: resolve(directory, "action.yml"),
    data: {
      name,
      description,
      inputs: {
        "gh-token": {
          description: "GitHub token with read access to the repository",
          required: false,
          default: "${{ github.token }}",
        },
      },
      outputs: {
        result: {
          description: "Some result from this action",
        },
      },
      runs: {
        using: "node16",
        main: "dist/index.cjs",
      },
    },
  });

  // Example code
  enqueueInstallDependency({
    directory,
    identifier: ["@actions/core", "@actions/github"],
  });

  await writeFile({
    path: join(directory, "src/index.ts"),
    contents: `
import { getInput, info, setFailed, setOutput } from "@actions/core";
import { context, getOctokit } from "@actions/github";

async function run() {
  const ghToken = getInput("gh-token");

  if (!ghToken) {
    throw new Error("The GitHub token is missing");
  }

  // Example logic
  const octokit = getOctokit(ghToken);
  const { owner, repo } = context.repo;

  const response = await octokit.rest.repos.getReadme({
    owner,
    repo,
  });

  info("Action complete");

  return {
    result: response.data.content,
  };
}

run()
  .then((outputs) =>
    Object.entries(outputs).forEach(([key, value]) => {
      setOutput(key, value);
    })
  )
  .catch(setFailed);
`,
  });

  await writeFile({
    path: join(directory, "README.md"),
    contents: `
# ${name} action

${description}

## Usage

\`\`\`yaml
- uses: ${name}@v1
  with:
    gh-token: \${{ secrets.GH_PAT }}
\`\`\`

## Inputs

| name       | required | default        | description                                     |
| ---------- | -------- | -------------- | ----------------------------------------------- |
| \`gh-token\` |          | \`github.token\` | GitHub token with read access to the repository |


## Outputs

| name     | description                  |
| -------- | ---------------------------- |
| \`result\` | Some result from this action |
`,
  });

  if (await hasPlugin({ directory, name: "semantic-release" })) {
    warning(
      `Please modify your ".releaserc.json" file:
- Set "semantic-release-yarn.npmPublish" to "false" to prevent uploading this package to NPM. See [semantic-release-yarn plugin options](https://github.com/hongaar/semantic-release-yarn#plugin-options) for more information.
- Add "dist/index.cjs" to the "@semantic-release/git.assets" configuration to include the generated files in the release commit.`
    );
  }
}

export const githubAction = {
  type: PluginType.Repo,
  apply,
};
