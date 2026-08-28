/**
 * @file TypeScript types
 */

import "chrome";

/**
 * Plugin options
 */
export interface Options {
  /**
   * Manifest object
   */
  manifest: chrome.runtime.Manifest;

  /**
   * Destination path
   * @default `manifest.json`
   */
  dst?: string;
}
