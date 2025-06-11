/* eslint-disable camelcase */
/**
 * @file Vite config
 */

// Imports
import {dirname, join} from "node:path";
import {fileURLToPath} from "node:url";

import solidDevtools from "solid-devtools/vite";
import unoCSS from "unocss/vite";
import {defineConfig} from "vite";
import solid from "vite-plugin-solid";
import paths from "vite-tsconfig-paths";

import pkg from "./package.json";
import manifest from "./plugins/manifest";
import relative from "./plugins/relative";

// Get the root directory
export const root = dirname(fileURLToPath(import.meta.url));

// Export
export default defineConfig({
  build: {
    emptyOutDir: false,
    minify: false,
    sourcemap: true,
  },
  define: {
    "import.meta.env.VERSION": JSON.stringify(pkg.version),
  },
  plugins: [
    solidDevtools(),
    solid(),
    unoCSS(),
    paths({
      projects: [join(root, "tsconfig.json")],
    }),
    manifest({
      manifest: {
        browser_specific_settings: {
          gecko: {
            id: "extension@io.github.wakeful-clouds.new-tab",
          },
        },
        chrome_settings_overrides: {
          homepage: "index.html",
        },
        chrome_url_overrides: {
          newtab: "index.html",
        },
        description: pkg.description,
        manifest_version: 3,
        name: "New Tab",
        permissions: ["storage", "unlimitedStorage"],
        version: pkg.version,
      },
    }),
    relative(),
  ],
});
