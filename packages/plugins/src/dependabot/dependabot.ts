import {
  hasPlugin,
  PluginArgs,
  PluginType,
  readYaml,
  removeFile,
  writeYaml,
} from "@mokr/core";
import { join } from "node:path";

// https://raw.githubusercontent.com/SchemaStore/schemastore/7c8f14cef422b87feacb525722710121947fd8c9/src/schemas/json/dependabot-2.0.json
type DependencyType =
  | "direct"
  | "indirect"
  | "all"
  | "production"
  | "development";
type ScheduleInterval = "daily" | "weekly" | "monthly";

type GitHubDependabotV2Config = {
  version: string | number;
  updates: PackageEcosystem[];
  registries?: Registries;
};
/**
 * Element for each one package manager that you want GitHub Dependabot to monitor for new versions
 */
interface PackageEcosystem {
  /**
   * Customize which updates are allowed
   */
  allow?: {
    "dependency-name"?: string;
    "dependency-type"?: DependencyType;
    [k: string]: any;
  }[];
  /**
   * Assignees to set on pull requests
   */
  assignees?: string[];
  /**
   * Commit message preferences
   */
  "commit-message"?: {
    prefix?: string;
    "prefix-development"?: string;
    include?: "scope";
    [k: string]: any;
  };
  /**
   * Location of package manifests
   */
  directory: string;
  /**
   * Ignore certain dependencies or versions
   */
  ignore?: {
    "dependency-name"?: string;
    "dependency-type"?: DependencyType;
    versions?: string[];
    [k: string]: any;
  }[];
  /**
   * Labels to set on pull requests
   */
  labels?: string[];
  /**
   * Milestone to set on pull requests
   */
  milestone?: string | number;
  /**
   * Limit number of open pull requests for version updates
   */
  "open-pull-requests-limit"?: number;
  /**
   * Package manager to use
   */
  "package-ecosystem":
    | "bundler"
    | "cargo"
    | "composer"
    | "docker"
    | "elm"
    | "gitsubmodule"
    | "github-actions"
    | "gomod"
    | "gradle"
    | "maven"
    | "mix"
    | "npm"
    | "nuget"
    | "pip"
    | "pub"
    | "terraform";
  /**
   * Pull request branch name preferences
   */
  "pull-request-branch-name"?: {
    /**
     * Change separator for PR branch name
     */
    separator: string;
    [k: string]: any;
  };
  /**
   * Disable automatic rebasing
   */
  "rebase-strategy"?: "auto" | "disabled";
  /**
   * Reviewers to set on pull requests
   */
  reviewers?: string[];
  /**
   * Schedule preferences
   */
  schedule: {
    interval?: ScheduleInterval;
    /**
     * Specify an alternative day to check for updates
     */
    day?:
      | "monday"
      | "tuesday"
      | "wednesday"
      | "thursday"
      | "friday"
      | "saturday"
      | "sunday";
    /**
     * Specify an alternative time of day to check for updates (format: hh:mm)
     */
    time?: string;
    /**
     * The time zone identifier must be from the Time Zone database maintained by IANA
     */
    timezone?: string;
    [k: string]: any;
  };
  /**
   * Branch to create pull requests against
   */
  "target-branch"?: string;
  /**
   * How to update manifest version requirements
   */
  "versioning-strategy"?:
    | "lockfile-only"
    | "auto"
    | "widen"
    | "increase"
    | "increase-if-necessary";
  [k: string]: any;
}
/**
 * The top-level registries key is optional. It allows you to specify authentication details that Dependabot can use to access private package registries.
 */
interface Registries {
  /**
   * This interface was referenced by `Registries`'s JSON-Schema definition
   * via the `patternProperty` ".*".
   */
  [k: string]: {
    /**
     * Identifies the type of registry.
     */
    type:
      | "composer-repository"
      | "docker-registry"
      | "git"
      | "hex-organization"
      | "maven-repository"
      | "npm-registry"
      | "nuget-feed"
      | "python-index"
      | "rubygems-server"
      | "terraform-registry";
    /**
     * The URL to use to access the dependencies in this registry. The protocol is optional. If not specified, https:// is assumed. Dependabot adds or ignores trailing slashes as required.
     */
    url?: string;
    /**
     * The username that Dependabot uses to access the registry.
     */
    username?: string;
    /**
     * A reference to a Dependabot secret containing the password for the specified user.
     */
    password?: string;
    /**
     * A reference to a Dependabot secret containing an access key for this registry.
     */
    key?: string;
    /**
     * A reference to a Dependabot secret containing an access token for this registry.
     */
    token?: string;
    /**
     * For registries with type: python-index, if the boolean value is true, pip resolves dependencies by using the specified URL rather than the base URL of the Python Package Index (by default https://pypi.org/simple).
     */
    "replaces-base"?: boolean;
    organization?: string;
  };
}

const FILENAME = ".github/dependabot.yml";

async function install({ directory }: PluginArgs) {
  await writeYaml({
    path: join(directory, FILENAME),
    data: {
      version: 2,
      updates: [
        {
          "package-ecosystem": "npm",
          directory: "/",
          schedule: {
            interval: "weekly",
          },
        },
      ],
    },
  });
}

async function remove({ directory }: PluginArgs) {
  await removeFile({ path: join(directory, FILENAME) });
}

async function load({ directory }: PluginArgs) {
  const path = join(directory, FILENAME);
  if (await hasPlugin({ directory, name: "github-actions" })) {
    const existingData = await readYaml<GitHubDependabotV2Config>({ path });

    if (
      !existingData.updates?.find(
        (update) => update["package-ecosystem"] === "github-actions"
      )
    ) {
      await writeYaml<GitHubDependabotV2Config>({
        path: join(directory, FILENAME),
        data: {
          updates: [
            {
              "package-ecosystem": "github-actions",
              directory: "/",
              schedule: {
                interval: "weekly",
              },
            },
          ],
        },
      });
    }
  }
}

export const dependabot = {
  type: PluginType.Monorepo,
  install,
  remove,
  load,
};
