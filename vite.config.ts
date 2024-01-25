/* eslint-disable camelcase */
/**
 * @fileoverview Vite config
 */

//Imports
import {dirname, join} from "path";
import SolidDevtools from "solid-devtools/vite";
import UnoCSS from "unocss/vite";
import {fileURLToPath} from "url";
import {defineConfig} from "vite";
import Solid from "vite-plugin-solid";
import Paths from "vite-tsconfig-paths";
import pkg from "./package.json";
import Manifest from "./plugins/manifest";
import Relative from "./plugins/relative";

//Get the root directory
export const root = dirname(fileURLToPath(import.meta.url));

//Export
export default defineConfig({
  build: {
    emptyOutDir: false,
    minify: false,
    sourcemap: true
  },
  define: {
    "import.meta.env.VERSION": JSON.stringify(pkg.version)
  },
  plugins: [
    SolidDevtools(),
    Solid(),
    UnoCSS(),
    Paths({
      projects: [join(root, "tsconfig.json")]
    }),
    Manifest({
      manifest: {
        manifest_version: 3,
        name: "New Tab",
        version: pkg.version,
        description: pkg.description,
        permissions: ["storage", "unlimitedStorage"],
        chrome_url_overrides: {
          newtab: "index.html"
        },
        chrome_settings_overrides: {
          homepage: "index.html"
        },
        browser_specific_settings: {
          gecko: {
            id: "extension@io.github.wakeful-clouds.new-tab"
          }
        }
      }
    }),
    Relative()
  ]
});
