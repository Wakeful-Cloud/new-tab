/**
 * @file TypeScript types
 */

// Imports
import type {Manifest} from "webextension-polyfill";

/**
 * Plugin options
 */
export interface Options {
  /**
   * Manifest object
   */
  manifest: Manifest.WebExtensionManifest;

  /**
   * Destination path
   * @default `manifest.json`
   */
  dst?: string;
}
