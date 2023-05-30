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
