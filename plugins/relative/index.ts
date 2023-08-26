/**
 * @fileoverview Vite relative path plugin
 */

//Imports
import {Plugin, ResolvedConfig} from "vite";
import {dirname, join, relative} from "path";

/**
 * Vite relative path plugin factory
 * @returns Plugin instance
 */
const plugin = () => {
  //State
  let config: ResolvedConfig;

  return {
    name: "relative",
    enforce: "post",
    apply: "build",
    configResolved: resolved => {
      //Update the config
      config = resolved;
    },
    transformIndexHtml: (html, ctx) => {
      //Get the HTML path
      const absolutePath = join(config.build.outDir, ctx.path);

      //Get the relative path
      const relativePath = join(
        relative(dirname(absolutePath), config.build.outDir),
        "assets"
      );

      //Replace the paths
      return html.replace(/(?<=")\/assets(?=\/[^"]+)/g, relativePath);
    }
  } as Plugin;
};

//Export
export default plugin;
