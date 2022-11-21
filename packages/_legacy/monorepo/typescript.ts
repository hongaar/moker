import { CreateMonorepoOptions, Monorepo, Plugins } from "@mokr/core";

export async function typescript(
  monorepo: Monorepo,
  {
    scoped,
    license,
    initialVersion: version,
    workspacesDirectory,
  }: CreateMonorepoOptions,
  plugins: Plugins
) {
  const workspaces = [`${workspacesDirectory}/*`];

  // yarn
  // yarn init -2
  // run steps in migration guide: https://yarnpkg.com/getting-started/migration
  // yarn plugin import interactive-tools
  // yarn plugin import typescript
  // yarn plugin import workspace-tools
  await plugins.npmPackage(monorepo, {
    name: monorepo.name,
    license,
    workspaces,
    mokr: {
      scoped,
    },
  });
  await plugins.lerna(monorepo, {
    version,
    workspaces,
  });
  await plugins.typescript(monorepo);
  await plugins.readme(monorepo);
  await plugins.gitignore(monorepo);
  await plugins.jest(monorepo);
  await plugins.prettier(monorepo, "*.{ts,tsx}");

  await monorepo.installQueue();
}
