/**
 * @fileoverview Vite manifest plugin
 */

//Imports
import {Options} from "./types";
import {Plugin, ResolvedConfig} from "vite";
import {dirname, join} from "path";
import {merge} from "lodash-es";
import {mkdir, writeFile} from "fs/promises";

/**
 * Vite manifest plugin factory
 * @param rawOptions Plugin options
 * @returns Plugin instance
 */
const plugin = (options: Options) => {
  //Default options
  options = merge(
    {
      dst: "manifest.json"
    },
    options
  );

  //State
  let config: ResolvedConfig;

  return {
    name: "manifest",
    configResolved: resolved => {
      //Update the config
      config = resolved;
    },
    closeBundle: async () => {
      //Ensure the manifest exists
      if (options.manifest === undefined) {
        throw new Error("Manifest is undefined!");
      }

      //Stringify the manifest
      const str = JSON.stringify(options.manifest, undefined, 2);

      //Get the destination path
      const dst = join(config.build.outDir, options.dst!);

      //Create the manifest folder
      await mkdir(dirname(dst), {
        recursive: true
      });

      //Write the manifest
      await writeFile(dst, str);
    }
  } as Plugin;
};

//Export
export default plugin;
