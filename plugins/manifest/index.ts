/**
 * @file Vite manifest plugin
 */

// Imports
import {mkdir, writeFile} from "node:fs/promises";
import {dirname, join} from "node:path";

import {merge} from "lodash-es";
import {Plugin, ResolvedConfig} from "vite";

import {Options} from "./types";

/**
 * Vite manifest plugin factory
 * @param options Plugin options
 * @returns Plugin instance
 */
const plugin = (options: Options) => {
  // Resolve the options
  const resolvedOptions = merge(
    {
      dst: "manifest.json",
    },
    options,
  ) as Options;

  // State
  let config: ResolvedConfig;

  return {
    closeBundle: async () => {
      // Ensure the manifest exists
      if (resolvedOptions.manifest === undefined) {
        throw new Error("Manifest is undefined!");
      }

      // Stringify the manifest
      const str = JSON.stringify(resolvedOptions.manifest, undefined, 2);

      // Get the destination path
      const dst = join(config.build.outDir, resolvedOptions.dst!);

      // Create the manifest folder
      await mkdir(dirname(dst), {
        recursive: true,
      });

      // Write the manifest
      await writeFile(dst, str);
    },
    configResolved: resolved => {
      // Update the config
      config = resolved;
    },
    name: "manifest",
  } as Plugin;
};

// Export
export default plugin;
