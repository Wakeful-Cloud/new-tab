// oxlint-disable no-restricted-imports
/**
 * @file Vite manifest plugin
 */

import {merge} from "es-toolkit";
import {mkdir, writeFile} from "node:fs/promises";
import path from "node:path";
import type {Plugin, ResolvedConfig} from "vite";
import type {Options} from "./types.ts";

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
  let config: ResolvedConfig | undefined = undefined;

  return {
    closeBundle: async () => {
      // Check if the config is undefined
      if (config === undefined) {
        throw new Error("Config is undefined!");
      }

      // Ensure the manifest exists
      if (resolvedOptions.manifest === undefined) {
        throw new Error("Manifest is undefined!");
      }

      // Stringify the manifest
      const str = JSON.stringify(resolvedOptions.manifest, undefined, 2);

      // Get the destination path
      const dst = path.join(config.build.outDir, resolvedOptions.dst!);

      // Create the manifest folder
      await mkdir(path.dirname(dst), {
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
