// Legacy
import * as plugins from "./plugins/index.js";

export * from "./parts/index.js";
export { plugins };

export type Plugins = typeof plugins;

// New
export * from "./monorepo.js";
export * from "./utils/index.js";