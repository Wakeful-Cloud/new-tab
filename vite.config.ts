// oxlint-disable no-restricted-imports
/**
 * @file Vite config
 */

import vue from "@vitejs/plugin-vue";
import unoCSS from "unocss/vite";
import {defineConfig} from "vite";
import pkg from "./package.json" with {type: "json"};
import manifest from "./plugins/manifest/index.ts";
import relative from "./plugins/relative/index.ts";

// Get the root directory
export const root = import.meta.dirname;

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
    vue(),
    unoCSS(),
    manifest({
      manifest: {
        browser_specific_settings: {
          gecko: {
            data_collection_permissions: {
              required: ["none"],
            },
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
            "default-src 'self'; connect-src 'self' data: https://api.pexels.com https://images.pexels.com https://api.unsplash.com https://images.unsplash.com; img-src 'self' data:; style-src 'self' 'sha256-6iIa14FFXgmf+2rpX7H7iLFuV/PEgtYHjl+5YRBnDVA=';",
        },
        description: pkg.description,
        developer: {
          name: "Wakeful Cloud",
          url: "https://wakefulcloud.dev",
        },
        homepage_url: "https://github.com/Wakeful-Cloud/new-tab",
        manifest_version: 3,
        // See https://developer.chrome.com/docs/extensions/develop/concepts/browser-namespace#when
        minimum_chrome_version: "148",
        name: "New Tab",
        permissions: ["storage"],
        version: pkg.version,
      },
    }),
    relative(),
  ],
  resolve: {
    tsconfigPaths: true,
  },
});
