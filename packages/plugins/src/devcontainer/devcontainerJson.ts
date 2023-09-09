import { readJson, removeFile, writeJson } from "@mokr/core";
import { join } from "node:path";

// https://github.com/devcontainers/spec/blob/main/schemas/devContainer.base.schema.json
type DevcontainerJsonBase =
  | ((
      | ((DockerfileContainer | ImageContainer) & NonComposeBase)
      | ComposeContainer
    ) &
      DevContainerCommon)
  | {
      name?: string;
      features?: {
        [k: string]: any;
      };
      forwardPorts?: (number | string)[];
      portsAttributes?: {
        [k: string]: {
          onAutoForward?:
            | "notify"
            | "openBrowser"
            | "openBrowserOnce"
            | "openPreview"
            | "silent"
            | "ignore";
          elevateIfNeeded?: boolean;
          label?: string;
          requireLocalPort?: boolean;
          protocol?: "http" | "https";
          [k: string]: any;
        };
      };
      otherPortsAttributes?: {
        onAutoForward?:
          | "notify"
          | "openBrowser"
          | "openPreview"
          | "silent"
          | "ignore";
        elevateIfNeeded?: boolean;
        label?: string;
        requireLocalPort?: boolean;
        protocol?: "http" | "https";
      };
      updateRemoteUserUID?: boolean;
      containerEnv?: {
        [k: string]: string;
      };
      containerUser?: string;
      mounts?: (Mount | string)[];
      init?: boolean;
      privileged?: boolean;
      capAdd?: string[];
      securityOpt?: string[];
      remoteEnv?: {
        [k: string]: string | null;
      };
      remoteUser?: string;
      initializeCommand?: string | string[];
      onCreateCommand?:
        | string
        | string[]
        | {
            [k: string]: string | string[];
          };
      updateContentCommand?:
        | string
        | string[]
        | {
            [k: string]: string | string[];
          };
      postCreateCommand?:
        | string
        | string[]
        | {
            [k: string]: string | string[];
          };
      postStartCommand?:
        | string
        | string[]
        | {
            [k: string]: string | string[];
          };
      postAttachCommand?:
        | string
        | string[]
        | {
            [k: string]: string | string[];
          };
      waitFor?:
        | "initializeCommand"
        | "onCreateCommand"
        | "updateContentCommand"
        | "postCreateCommand"
        | "postStartCommand";
      userEnvProbe?:
        | "none"
        | "loginShell"
        | "loginInteractiveShell"
        | "interactiveShell";
      hostRequirements?: {
        cpus?: number;
        memory?: string;
        storage?: string;
        [k: string]: any;
      };
      customizations?: {
        [k: string]: any;
      };
      additionalProperties?: {
        [k: string]: any;
      };
    };

type DockerfileContainer =
  | {
      build: {
        dockerfile: string;
        context?: string;
        [k: string]: any;
      } & BuildOptions;
      [k: string]: any;
    }
  | ({
      dockerFile: string;
      context?: string;
      [k: string]: any;
    } & {
      build?: {
        target?: string;
        args?: {
          [k: string]: string;
        };
        cacheFrom?: string | string[];
        [k: string]: any;
      };
      [k: string]: any;
    });

interface BuildOptions {
  target?: string;
  args?: {
    [k: string]: string;
  };
  cacheFrom?: string | string[];
  [k: string]: any;
}

interface ImageContainer {
  image: string;
  [k: string]: any;
}

interface NonComposeBase {
  appPort?: number | string | (number | string)[];
  runArgs?: string[];
  shutdownAction?: "none" | "stopContainer";
  overrideCommand?: boolean;
  workspaceFolder?: string;
  workspaceMount?: string;
  [k: string]: any;
}

interface ComposeContainer {
  dockerComposeFile: string | string[];
  service: string;
  runServices?: string[];
  workspaceFolder: string;
  shutdownAction?: "none" | "stopCompose";
  overrideCommand?: boolean;
  [k: string]: any;
}

interface DevContainerCommon {
  name?: string;
  features?: {
    [k: string]: any;
  };
  forwardPorts?: (number | string)[];
  portsAttributes?: {
    [k: string]: {
      onAutoForward?:
        | "notify"
        | "openBrowser"
        | "openBrowserOnce"
        | "openPreview"
        | "silent"
        | "ignore";
      elevateIfNeeded?: boolean;
      label?: string;
      requireLocalPort?: boolean;
      protocol?: "http" | "https";
      [k: string]: any;
    };
  };
  otherPortsAttributes?: {
    onAutoForward?:
      | "notify"
      | "openBrowser"
      | "openPreview"
      | "silent"
      | "ignore";
    elevateIfNeeded?: boolean;
    label?: string;
    requireLocalPort?: boolean;
    protocol?: "http" | "https";
  };
  updateRemoteUserUID?: boolean;
  containerEnv?: {
    [k: string]: string;
  };
  containerUser?: string;
  mounts?: (Mount | string)[];
  init?: boolean;
  privileged?: boolean;
  capAdd?: string[];
  securityOpt?: string[];
  remoteEnv?: {
    [k: string]: string | null;
  };
  remoteUser?: string;
  initializeCommand?: string | string[];
  onCreateCommand?:
    | string
    | string[]
    | {
        [k: string]: string | string[];
      };
  updateContentCommand?:
    | string
    | string[]
    | {
        [k: string]: string | string[];
      };
  postCreateCommand?:
    | string
    | string[]
    | {
        [k: string]: string | string[];
      };
  postStartCommand?:
    | string
    | string[]
    | {
        [k: string]: string | string[];
      };
  postAttachCommand?:
    | string
    | string[]
    | {
        [k: string]: string | string[];
      };
  waitFor?:
    | "initializeCommand"
    | "onCreateCommand"
    | "updateContentCommand"
    | "postCreateCommand"
    | "postStartCommand";
  userEnvProbe?:
    | "none"
    | "loginShell"
    | "loginInteractiveShell"
    | "interactiveShell";
  hostRequirements?: {
    cpus?: number;
    memory?: string;
    storage?: string;
    [k: string]: any;
  };
  customizations?: {
    [k: string]: any;
  };
  additionalProperties?: {
    [k: string]: any;
  };
  [k: string]: any;
}

interface Mount {
  type: "bind" | "volume";
  source: string;
  target: string;
}

// https://raw.githubusercontent.com/microsoft/vscode/main/extensions/configuration-editing/schemas/devContainer.vscode.schema.json
interface DevcontainerJsonVSCode {
  customizations?: {
    vscode?: {
      extensions?: string[];
      settings?: {
        [k: string]: any;
      };
      devPort?: number;
      [k: string]: any;
    };
    [k: string]: any;
  };
  extensions?: string[];
  settings?: {
    [k: string]: any;
  };
  devPort?: number;
  [k: string]: any;
}

// https://raw.githubusercontent.com/microsoft/vscode/main/extensions/configuration-editing/schemas/devContainer.codespaces.schema.json
interface DevcontainerJsonCodespaces {
  customizations?: {
    codespaces?: {
      repositories?: {
        [k: string]: any;
      };
      openFiles?: string[];
      [k: string]: any;
    };
    [k: string]: any;
  };
  codespaces?: {
    [k: string]: any;
  };
  [k: string]: any;
}

type DevcontainerJson = DevcontainerJsonBase &
  DevcontainerJsonVSCode &
  DevcontainerJsonCodespaces;

const DEVCONTAINER_FILENAME = ".devcontainer/devcontainer.json";

export async function readDevcontainerJson({
  directory,
}: {
  directory: string;
}) {
  return readJson<DevcontainerJson>({
    path: join(directory, DEVCONTAINER_FILENAME),
  });
}

export async function writeDevcontainerJson({
  directory,
  data,
}: {
  directory: string;
  data: DevcontainerJson;
}) {
  await writeJson({ path: join(directory, DEVCONTAINER_FILENAME), data });
}

export async function removeDevcontainerJson({
  directory,
}: {
  directory: string;
}) {
  await removeFile({ path: join(directory, DEVCONTAINER_FILENAME) });
}
