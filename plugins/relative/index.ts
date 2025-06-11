/**
 * @file Vite relative path plugin
 */

// Imports
import {dirname, join, relative} from "node:path";

import {Plugin, ResolvedConfig} from "vite";

/**
 * Vite relative path plugin factory
 * @returns Plugin instance
 */
const plugin = () => {
  // State
  let config: ResolvedConfig;

  return {
    apply: "build",
    configResolved: resolved => {
      // Update the config
      config = resolved;
    },
    enforce: "post",
    name: "relative",
    transformIndexHtml: (html, ctx) => {
      // Get the HTML path
      const absolutePath = join(config.build.outDir, ctx.path);

      // Get the relative path
      const relativePath = join(
        relative(dirname(absolutePath), config.build.outDir),
        "assets",
      );

      // Replace the paths
      return html.replace(/(?<=")\/assets(?=\/[^"]+)/gu, relativePath);
    },
  } as Plugin;
};

// Export
export default plugin;
