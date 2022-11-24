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
      /**
       * A name for the dev container which can be displayed to the user.
       */
      name?: string;
      /**
       * Features to add to the dev container.
       */
      features?: {
        [k: string]: any;
      };
      /**
       * Ports that are forwarded from the container to the local machine. Can be an integer port number, or a string of the format "host:port_number".
       */
      forwardPorts?: (number | string)[];
      portsAttributes?: {
        /**
         * A port, range of ports (ex. "40000-55000"), or regular expression (ex. ".+\\/server.js").  For a port number or range, the attributes will apply to that port number or range of port numbers. Attributes which use a regular expression will apply to ports whose associated process command line matches the expression.
         *
         * This interface was referenced by `undefined`'s JSON-Schema definition
         * via the `patternProperty` "(^\d+(-\d+)?$)|(.+)".
         */
        [k: string]: {
          /**
           * Defines the action that occurs when the port is discovered for automatic forwarding
           */
          onAutoForward?:
            | "notify"
            | "openBrowser"
            | "openBrowserOnce"
            | "openPreview"
            | "silent"
            | "ignore";
          /**
           * Automatically prompt for elevation (if needed) when this port is forwarded. Elevate is required if the local port is a privileged port.
           */
          elevateIfNeeded?: boolean;
          /**
           * Label that will be shown in the UI for this port.
           */
          label?: string;
          requireLocalPort?: boolean;
          /**
           * The protocol to use when forwarding this port.
           */
          protocol?: "http" | "https";
          [k: string]: any;
        };
      };
      otherPortsAttributes?: {
        /**
         * Defines the action that occurs when the port is discovered for automatic forwarding
         */
        onAutoForward?:
          | "notify"
          | "openBrowser"
          | "openPreview"
          | "silent"
          | "ignore";
        /**
         * Automatically prompt for elevation (if needed) when this port is forwarded. Elevate is required if the local port is a privileged port.
         */
        elevateIfNeeded?: boolean;
        /**
         * Label that will be shown in the UI for this port.
         */
        label?: string;
        requireLocalPort?: boolean;
        /**
         * The protocol to use when forwarding this port.
         */
        protocol?: "http" | "https";
      };
      /**
       * Controls whether on Linux the container's user should be updated with the local user's UID and GID. On by default when opening from a local folder.
       */
      updateRemoteUserUID?: boolean;
      /**
       * Container environment variables.
       */
      containerEnv?: {
        [k: string]: string;
      };
      /**
       * The user the container will be started with. The default is the user on the Docker image.
       */
      containerUser?: string;
      /**
       * Mount points to set up when creating the container. See Docker's documentation for the --mount option for the supported syntax.
       */
      mounts?: (Mount | string)[];
      /**
       * Passes the --init flag when creating the dev container.
       */
      init?: boolean;
      /**
       * Passes the --privileged flag when creating the dev container.
       */
      privileged?: boolean;
      /**
       * Passes docker capabilities to include when creating the dev container.
       */
      capAdd?: string[];
      /**
       * Passes docker security options to include when creating the dev container.
       */
      securityOpt?: string[];
      /**
       * Remote environment variables to set for processes spawned in the container including lifecycle scripts and any remote editor/IDE server process.
       */
      remoteEnv?: {
        [k: string]: string | null;
      };
      /**
       * The username to use for spawning processes in the container including lifecycle scripts and any remote editor/IDE server process. The default is the same user as the container.
       */
      remoteUser?: string;
      /**
       * A command to run locally before anything else. This command is run before "onCreateCommand". If this is a single string, it will be run in a shell. If this is an array of strings, it will be run as a single command without shell.
       */
      initializeCommand?: string | string[];
      /**
       * A command to run when creating the container. This command is run after "initializeCommand" and before "updateContentCommand". If this is a single string, it will be run in a shell. If this is an array of strings, it will be run as a single command without shell.
       */
      onCreateCommand?:
        | string
        | string[]
        | {
            [k: string]: string | string[];
          };
      /**
       * A command to run when creating the container and rerun when the workspace content was updated while creating the container. This command is run after "onCreateCommand" and before "postCreateCommand". If this is a single string, it will be run in a shell. If this is an array of strings, it will be run as a single command without shell.
       */
      updateContentCommand?:
        | string
        | string[]
        | {
            [k: string]: string | string[];
          };
      /**
       * A command to run after creating the container. This command is run after "updateContentCommand" and before "postStartCommand". If this is a single string, it will be run in a shell. If this is an array of strings, it will be run as a single command without shell.
       */
      postCreateCommand?:
        | string
        | string[]
        | {
            [k: string]: string | string[];
          };
      /**
       * A command to run after starting the container. This command is run after "postCreateCommand" and before "postAttachCommand". If this is a single string, it will be run in a shell. If this is an array of strings, it will be run as a single command without shell.
       */
      postStartCommand?:
        | string
        | string[]
        | {
            [k: string]: string | string[];
          };
      /**
       * A command to run when attaching to the container. This command is run after "postStartCommand". If this is a single string, it will be run in a shell. If this is an array of strings, it will be run as a single command without shell.
       */
      postAttachCommand?:
        | string
        | string[]
        | {
            [k: string]: string | string[];
          };
      /**
       * The user command to wait for before continuing execution in the background while the UI is starting up. The default is "updateContentCommand".
       */
      waitFor?:
        | "initializeCommand"
        | "onCreateCommand"
        | "updateContentCommand"
        | "postCreateCommand"
        | "postStartCommand";
      /**
       * User environment probe to run. The default is "loginInteractiveShell".
       */
      userEnvProbe?:
        | "none"
        | "loginShell"
        | "loginInteractiveShell"
        | "interactiveShell";
      /**
       * Host hardware requirements.
       */
      hostRequirements?: {
        /**
         * Number of required CPUs.
         */
        cpus?: number;
        /**
         * Amount of required RAM in bytes. Supports units tb, gb, mb and kb.
         */
        memory?: string;
        /**
         * Amount of required disk space in bytes. Supports units tb, gb, mb and kb.
         */
        storage?: string;
        [k: string]: any;
      };
      /**
       * Tool-specific configuration. Each tool should use a JSON object subproperty with a unique name to group its customizations.
       */
      customizations?: {
        [k: string]: any;
      };
      additionalProperties?: {
        [k: string]: any;
      };
    };
type DockerfileContainer =
  | {
      /**
       * Docker build-related options.
       */
      build: {
        /**
         * The location of the Dockerfile that defines the contents of the container. The path is relative to the folder containing the `devcontainer.json` file.
         */
        dockerfile: string;
        /**
         * The location of the context folder for building the Docker image. The path is relative to the folder containing the `devcontainer.json` file.
         */
        context?: string;
        [k: string]: any;
      } & BuildOptions;
      [k: string]: any;
    }
  | ({
      /**
       * The location of the Dockerfile that defines the contents of the container. The path is relative to the folder containing the `devcontainer.json` file.
       */
      dockerFile: string;
      /**
       * The location of the context folder for building the Docker image. The path is relative to the folder containing the `devcontainer.json` file.
       */
      context?: string;
      [k: string]: any;
    } & {
      /**
       * Docker build-related options.
       */
      build?: {
        /**
         * Target stage in a multi-stage build.
         */
        target?: string;
        /**
         * Build arguments.
         */
        args?: {
          [k: string]: string;
        };
        /**
         * The image to consider as a cache. Use an array to specify multiple images.
         */
        cacheFrom?: string | string[];
        [k: string]: any;
      };
      [k: string]: any;
    });

interface BuildOptions {
  /**
   * Target stage in a multi-stage build.
   */
  target?: string;
  /**
   * Build arguments.
   */
  args?: {
    [k: string]: string;
  };
  /**
   * The image to consider as a cache. Use an array to specify multiple images.
   */
  cacheFrom?: string | string[];
  [k: string]: any;
}
interface ImageContainer {
  /**
   * The docker image that will be used to create the container.
   */
  image: string;
  [k: string]: any;
}
interface NonComposeBase {
  /**
   * Application ports that are exposed by the container. This can be a single port or an array of ports. Each port can be a number or a string. A number is mapped to the same port on the host. A string is passed to Docker unchanged and can be used to map ports differently, e.g. "8000:8010".
   */
  appPort?: number | string | (number | string)[];
  /**
   * The arguments required when starting in the container.
   */
  runArgs?: string[];
  /**
   * Action to take when the user disconnects from the container in their editor. The default is to stop the container.
   */
  shutdownAction?: "none" | "stopContainer";
  /**
   * Whether to overwrite the command specified in the image. The default is true.
   */
  overrideCommand?: boolean;
  /**
   * The path of the workspace folder inside the container.
   */
  workspaceFolder?: string;
  /**
   * The --mount parameter for docker run. The default is to mount the project folder at /workspaces/$project.
   */
  workspaceMount?: string;
  [k: string]: any;
}

interface ComposeContainer {
  /**
   * The name of the docker-compose file(s) used to start the services.
   */
  dockerComposeFile: string | string[];
  /**
   * The service you want to work on. This is considered the primary container for your dev environment which your editor will connect to.
   */
  service: string;
  /**
   * An array of services that should be started and stopped.
   */
  runServices?: string[];
  /**
   * The path of the workspace folder inside the container. This is typically the target path of a volume mount in the docker-compose.yml.
   */
  workspaceFolder: string;
  /**
   * Action to take when the user disconnects from the primary container in their editor. The default is to stop all of the compose containers.
   */
  shutdownAction?: "none" | "stopCompose";
  /**
   * Whether to overwrite the command specified in the image. The default is false.
   */
  overrideCommand?: boolean;
  [k: string]: any;
}

interface DevContainerCommon {
  /**
   * A name for the dev container which can be displayed to the user.
   */
  name?: string;
  /**
   * Features to add to the dev container.
   */
  features?: {
    [k: string]: any;
  };
  /**
   * Ports that are forwarded from the container to the local machine. Can be an integer port number, or a string of the format "host:port_number".
   */
  forwardPorts?: (number | string)[];
  portsAttributes?: {
    /**
     * A port, range of ports (ex. "40000-55000"), or regular expression (ex. ".+\\/server.js").  For a port number or range, the attributes will apply to that port number or range of port numbers. Attributes which use a regular expression will apply to ports whose associated process command line matches the expression.
     *
     * This interface was referenced by `undefined`'s JSON-Schema definition
     * via the `patternProperty` "(^\d+(-\d+)?$)|(.+)".
     */
    [k: string]: {
      /**
       * Defines the action that occurs when the port is discovered for automatic forwarding
       */
      onAutoForward?:
        | "notify"
        | "openBrowser"
        | "openBrowserOnce"
        | "openPreview"
        | "silent"
        | "ignore";
      /**
       * Automatically prompt for elevation (if needed) when this port is forwarded. Elevate is required if the local port is a privileged port.
       */
      elevateIfNeeded?: boolean;
      /**
       * Label that will be shown in the UI for this port.
       */
      label?: string;
      requireLocalPort?: boolean;
      /**
       * The protocol to use when forwarding this port.
       */
      protocol?: "http" | "https";
      [k: string]: any;
    };
  };
  otherPortsAttributes?: {
    /**
     * Defines the action that occurs when the port is discovered for automatic forwarding
     */
    onAutoForward?:
      | "notify"
      | "openBrowser"
      | "openPreview"
      | "silent"
      | "ignore";
    /**
     * Automatically prompt for elevation (if needed) when this port is forwarded. Elevate is required if the local port is a privileged port.
     */
    elevateIfNeeded?: boolean;
    /**
     * Label that will be shown in the UI for this port.
     */
    label?: string;
    requireLocalPort?: boolean;
    /**
     * The protocol to use when forwarding this port.
     */
    protocol?: "http" | "https";
  };
  /**
   * Controls whether on Linux the container's user should be updated with the local user's UID and GID. On by default when opening from a local folder.
   */
  updateRemoteUserUID?: boolean;
  /**
   * Container environment variables.
   */
  containerEnv?: {
    [k: string]: string;
  };
  /**
   * The user the container will be started with. The default is the user on the Docker image.
   */
  containerUser?: string;
  /**
   * Mount points to set up when creating the container. See Docker's documentation for the --mount option for the supported syntax.
   */
  mounts?: (Mount | string)[];
  /**
   * Passes the --init flag when creating the dev container.
   */
  init?: boolean;
  /**
   * Passes the --privileged flag when creating the dev container.
   */
  privileged?: boolean;
  /**
   * Passes docker capabilities to include when creating the dev container.
   */
  capAdd?: string[];
  /**
   * Passes docker security options to include when creating the dev container.
   */
  securityOpt?: string[];
  /**
   * Remote environment variables to set for processes spawned in the container including lifecycle scripts and any remote editor/IDE server process.
   */
  remoteEnv?: {
    [k: string]: string | null;
  };
  /**
   * The username to use for spawning processes in the container including lifecycle scripts and any remote editor/IDE server process. The default is the same user as the container.
   */
  remoteUser?: string;
  /**
   * A command to run locally before anything else. This command is run before "onCreateCommand". If this is a single string, it will be run in a shell. If this is an array of strings, it will be run as a single command without shell.
   */
  initializeCommand?: string | string[];
  /**
   * A command to run when creating the container. This command is run after "initializeCommand" and before "updateContentCommand". If this is a single string, it will be run in a shell. If this is an array of strings, it will be run as a single command without shell.
   */
  onCreateCommand?:
    | string
    | string[]
    | {
        [k: string]: string | string[];
      };
  /**
   * A command to run when creating the container and rerun when the workspace content was updated while creating the container. This command is run after "onCreateCommand" and before "postCreateCommand". If this is a single string, it will be run in a shell. If this is an array of strings, it will be run as a single command without shell.
   */
  updateContentCommand?:
    | string
    | string[]
    | {
        [k: string]: string | string[];
      };
  /**
   * A command to run after creating the container. This command is run after "updateContentCommand" and before "postStartCommand". If this is a single string, it will be run in a shell. If this is an array of strings, it will be run as a single command without shell.
   */
  postCreateCommand?:
    | string
    | string[]
    | {
        [k: string]: string | string[];
      };
  /**
   * A command to run after starting the container. This command is run after "postCreateCommand" and before "postAttachCommand". If this is a single string, it will be run in a shell. If this is an array of strings, it will be run as a single command without shell.
   */
  postStartCommand?:
    | string
    | string[]
    | {
        [k: string]: string | string[];
      };
  /**
   * A command to run when attaching to the container. This command is run after "postStartCommand". If this is a single string, it will be run in a shell. If this is an array of strings, it will be run as a single command without shell.
   */
  postAttachCommand?:
    | string
    | string[]
    | {
        [k: string]: string | string[];
      };
  /**
   * The user command to wait for before continuing execution in the background while the UI is starting up. The default is "updateContentCommand".
   */
  waitFor?:
    | "initializeCommand"
    | "onCreateCommand"
    | "updateContentCommand"
    | "postCreateCommand"
    | "postStartCommand";
  /**
   * User environment probe to run. The default is "loginInteractiveShell".
   */
  userEnvProbe?:
    | "none"
    | "loginShell"
    | "loginInteractiveShell"
    | "interactiveShell";
  /**
   * Host hardware requirements.
   */
  hostRequirements?: {
    /**
     * Number of required CPUs.
     */
    cpus?: number;
    /**
     * Amount of required RAM in bytes. Supports units tb, gb, mb and kb.
     */
    memory?: string;
    /**
     * Amount of required disk space in bytes. Supports units tb, gb, mb and kb.
     */
    storage?: string;
    [k: string]: any;
  };
  /**
   * Tool-specific configuration. Each tool should use a JSON object subproperty with a unique name to group its customizations.
   */
  customizations?: {
    [k: string]: any;
  };
  additionalProperties?: {
    [k: string]: any;
  };
  [k: string]: any;
}

interface Mount {
  /**
   * Mount type.
   */
  type: "bind" | "volume";
  /**
   * Mount source.
   */
  source: string;
  /**
   * Mount target.
   */
  target: string;
}

// https://raw.githubusercontent.com/microsoft/vscode/main/extensions/configuration-editing/schemas/devContainer.vscode.schema.json
interface DevcontainerJsonVSCode {
  customizations?: {
    vscode?: {
      /**
       * An array of extensions that should be installed into the container.
       */
      extensions?: string[];
      /**
       * Machine specific settings that should be copied into the container. These are only copied when connecting to the container for the first time, rebuilding the container then triggers it again.
       */
      settings?: {
        [k: string]: any;
      };
      /**
       * The port VS Code can use to connect to its backend.
       */
      devPort?: number;
      [k: string]: any;
    };
    [k: string]: any;
  };
  /**
   * An array of extensions that should be installed into the container.
   */
  extensions?: string[];
  /**
   * Machine specific settings that should be copied into the container. These are only copied when connecting to the container for the first time, rebuilding the container then triggers it again.
   */
  settings?: {
    [k: string]: any;
  };
  /**
   * The port VS Code can use to connect to its backend.
   */
  devPort?: number;
  [k: string]: any;
}

// https://raw.githubusercontent.com/microsoft/vscode/main/extensions/configuration-editing/schemas/devContainer.codespaces.schema.json
interface DevcontainerJsonCodespaces {
  customizations?: {
    /**
     * Customizations specific to GitHub Codespaces
     */
    codespaces?: {
      /**
       * Configuration relative to the given repositories, following the format 'owner/repo'.
       *   A wildcard (*) is permitted for the repo name (eg: 'microsoft/*')
       */
      repositories?: {
        [k: string]: any;
      };
      /**
       * The paths to the files to open when the codespace is created. Paths are relative to the workspace.
       */
      openFiles?: string[];
      [k: string]: any;
    };
    [k: string]: any;
  };
  /**
   * Codespaces-specific configuration.
   */
  codespaces?: {
    [k: string]: any;
  };
  [k: string]: any;
}

type DevcontainerJson = DevcontainerJsonBase &
  DevcontainerJsonVSCode &
  DevcontainerJsonCodespaces;

const FILENAME = ".devcontainer/devcontainer.json";

export async function readDevcontainerJson({
  directory,
}: {
  directory: string;
}) {
  return readJson<DevcontainerJson>({
    path: join(directory, FILENAME),
  });
}

export async function writeDevcontainerJson({
  directory,
  data,
}: {
  directory: string;
  data: DevcontainerJson;
}) {
  await writeJson({ path: join(directory, FILENAME), data });
}

export async function removeDevcontainerJson({
  directory,
}: {
  directory: string;
}) {
  await removeFile({ path: join(directory, FILENAME) });
}
