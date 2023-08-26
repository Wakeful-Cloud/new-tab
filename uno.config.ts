/**
 * @fileoverview UnoCSS config
 */

//Imports
import presetWind from "@unocss/preset-wind";
import transformDirectives from "@unocss/transformer-directives";
import {defineConfig} from "unocss";

//Export
export default defineConfig({
  presets: [
    presetWind({
      dark: "class"
    })
  ],
  transformers: [transformDirectives()]
});
