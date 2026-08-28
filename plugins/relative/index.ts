/**
 * @file Vite relative path plugin
 */

import path from "node:path";

import type {Plugin, ResolvedConfig} from "vite";

/**
 * Vite relative path plugin factory
 * @returns Plugin instance
 */
const plugin = () => {
  // State
  let config: ResolvedConfig | undefined = undefined;

  return {
    apply: "build",
    configResolved: resolved => {
      // Update the config
      config = resolved;
    },
    enforce: "post",
    name: "relative",
    transformIndexHtml: (html, ctx) => {
      // Check if the config is undefined
      if (config === undefined) {
        throw new Error("Config is undefined!");
      }

      // Get the HTML path
      const absolutePath = path.join(config.build.outDir, ctx.path);

      // Get the relative path
      const relativePath = path.join(
        path.relative(path.dirname(absolutePath), config.build.outDir),
        "assets",
      );

      // Replace the paths
      return html.replaceAll(/(?<=")\/assets(?=\/[^"]+)/gu, relativePath);
    },
  } as Plugin;
};

// Export
export default plugin;
