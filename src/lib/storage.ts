/**
 * @file Storage abstraction
 */

// Imports
import {get as idbGet, set as idbSet} from "idb-keyval";
import {has as objHas, set as objSet} from "lodash-es";

// Set dummy runtime id
const dummyKey = "chrome.runtime.id";

if (!objHas(globalThis, dummyKey)) {
  objSet(globalThis, dummyKey, "dummy-id");
}

// Late imports
const webextensionPolyfill = import("webextension-polyfill");

/**
 * Get an item from storage
 * @param key Item key
 * @returns Item value
 */
export const get = async <T>(key: string): Promise<T | undefined> => {
  const {storage} = (await webextensionPolyfill).default;
  let raw: string | undefined = undefined;

  if (storage !== undefined && storage.local !== undefined) {
    raw = (await storage.local.get(key))?.[key] as string | undefined;
  } else {
    raw = await idbGet<string>(key);
  }

  return raw === undefined ? undefined : JSON.parse(raw);
};

/**
 * Set an item in storage
 * @param key Item key
 * @param value Item value
 */
export const set = async <T>(key: string, value: T) => {
  const {storage} = (await webextensionPolyfill).default;
  const raw = JSON.stringify(value);

  if (storage !== undefined && storage.local !== undefined) {
    await storage.local.set({
      [key]: raw,
    });
  } else {
    await idbSet(key, raw);
  }
};
