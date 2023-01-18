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

interface PackageEcosystem {
  allow?: {
    "dependency-name"?: string;
    "dependency-type"?: DependencyType;
    [k: string]: any;
  }[];
  assignees?: string[];
  "commit-message"?: {
    prefix?: string;
    "prefix-development"?: string;
    include?: "scope";
    [k: string]: any;
  };
  directory: string;
  ignore?: {
    "dependency-name"?: string;
    "dependency-type"?: DependencyType;
    versions?: string[];
    [k: string]: any;
  }[];
  labels?: string[];
  milestone?: string | number;
  "open-pull-requests-limit"?: number;
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
  "pull-request-branch-name"?: {
    separator: string;
    [k: string]: any;
  };
  "rebase-strategy"?: "auto" | "disabled";
  reviewers?: string[];
  schedule: {
    interval?: ScheduleInterval;
    day?:
      | "monday"
      | "tuesday"
      | "wednesday"
      | "thursday"
      | "friday"
      | "saturday"
      | "sunday";
    time?: string;
    timezone?: string;
    [k: string]: any;
  };
  "target-branch"?: string;
  "versioning-strategy"?:
    | "lockfile-only"
    | "auto"
    | "widen"
    | "increase"
    | "increase-if-necessary";
  [k: string]: any;
}

interface Registries {
  [k: string]: {
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
    url?: string;
    username?: string;
    password?: string;
    key?: string;
    token?: string;
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
          "commit-message": {
            prefix: "fix",
            "prefix-development": "chore",
            include: "scope",
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
  type: PluginType.Repo,
  install,
  remove,
  load,
};
