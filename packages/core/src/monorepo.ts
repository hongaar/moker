export const DEFAULT_SCOPED = true;
export const DEFAULT_LICENSE = "MIT";
export const DEFAULT_INITIAL_VERSION = "0.0.0";
export const DEFAULT_WORKSPACES_DIRECTORY = "packages";

type CreateMonorepoOptions = {
  directory: string;
  scoped?: boolean;
  license?: string;
  initialVersion?: string;
  workspacesDirectory?: string;
};

export function createMonorepo({
  directory,
  scoped = DEFAULT_SCOPED,
  license = DEFAULT_LICENSE,
  initialVersion = DEFAULT_INITIAL_VERSION,
  workspacesDirectory = DEFAULT_WORKSPACES_DIRECTORY,
}: CreateMonorepoOptions) {}
