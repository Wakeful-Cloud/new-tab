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
        author: "Wakeful Cloud",
        browser_specific_settings: {
          gecko: {
            id: "extension@io.github.wakeful-cloud.new-tab",
          },
        },
        chrome_settings_overrides: {
          homepage: "index.html",
        },
        chrome_url_overrides: {
          newtab: "index.html",
        },
        content_security_policy: {
          extension_pages:
            "default-src 'self'; connect-src 'self' https://api.pexels.com https://images.pexels.com https://api.unsplash.com https://images.unsplash.com; img-src 'self' data:",
        },
        description: pkg.description,
        developer: {
          name: "Wakeful Cloud",
          url: "https://wakefulcloud.dev",
        },
        homepage_url: "https://github.com/Wakeful-Cloud/new-tab",
        manifest_version: 3,
        name: "New Tab",
        permissions: ["storage", "unlimitedStorage"],
        version: pkg.version,
      },
    }),
    relative(),
  ],
});
