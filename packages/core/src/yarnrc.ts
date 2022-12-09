import path from "node:path";
import { readYaml, writeYaml } from "./yaml.js";

// https://yarnpkg.com/configuration/yarnrc
type Yarnrc = {
  cacheFolder: string;
  caFilePath: string;
  changesetBaseRefs: string[];
  changesetIgnorePatterns: string[];
  checksumBehavior: "throw" | "update" | "ignore";
  cloneConcurrency: number;
  compressionLevel: number | "mixed";
  constraintsPath: string;
  defaultLanguageName: string;
  defaultProtocol: string;
  defaultSemverRangePrefix: string;
  deferredVersionFolder: string;
  enableColors: boolean;
  enableGlobalCache: boolean;
  enableHyperlinks: boolean;
  enableImmutableCache: boolean;
  enableImmutableInstalls: boolean;
  // @todo: etc, fix later

  nodeLinker: "node-modules" | "pnp" | "pnpm";
  npmPublishAccess: "public" | "restricted";
};

const FILENAME = ".yarnrc.yml";

export async function readYarnrc({ directory }: { directory: string }) {
  return readYaml<Partial<Yarnrc>>({ path: path.join(directory, FILENAME) });
}

export async function writeYarnrc({
  directory,
  data,
}: {
  directory: string;
  data: Partial<Yarnrc>;
}) {
  await writeYaml({ path: path.join(directory, FILENAME), data });
}
