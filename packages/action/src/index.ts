import { info, setFailed, setOutput } from "@actions/core";
import {
  formatTask,
  loadPluginsTask,
  updateDependenciesTask,
} from "@mokr/core";

async function run() {
  const directory = process.cwd();

  await loadPluginsTask({ directory });

  await updateDependenciesTask({ directory });

  await formatTask({ directory });

  info("Action complete");

  return {
    result: "ok",
  };
}

run()
  .then((outputs) =>
    Object.entries(outputs).forEach(([key, value]) => {
      setOutput(key, value);
    })
  )
  .catch(setFailed);
