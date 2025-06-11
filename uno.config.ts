/**
 * @file UnoCSS config
 */

// Imports
import presetWind4 from "@unocss/preset-wind4";
import transformDirectives from "@unocss/transformer-directives";
import {defineConfig} from "unocss";

// Export
export default defineConfig({
  presets: [
    presetWind4({
      dark: "class",
      preflights: {
        reset: true,
      },
    }),
  ],
  transformers: [transformDirectives()],
});
