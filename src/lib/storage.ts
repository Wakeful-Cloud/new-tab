/**
 * @fileoverview Storage abstraction
 */

//Imports
import {get as idbGet, set as idbSet} from "idb-keyval";
import {has as objHas, set as objSet} from "lodash-es";

//Set dummy runtime id
const key = "chrome.runtime.id";
if (!objHas(globalThis, key)) {
  objSet(globalThis, key, "dummy-id");
}

//Late imports
const webextensionPolyfill = import("webextension-polyfill");

/**
 * Get an item from storage
 * @param key Item key
 * @param synced Whether to use synced or local storage
 * @returns Item value
 */
export const get = async <T>(
  key: string,
  synced: boolean
): Promise<T | undefined> => {
  const {storage} = (await webextensionPolyfill).default;
  let raw: string | undefined = undefined;

  if (synced && storage !== undefined && storage.sync !== undefined) {
    raw = (await storage.sync.get(key))?.[key];
  } else if (!synced && storage !== undefined && storage.local !== undefined) {
    raw = (await storage.local.get(key))?.[key];
  } else {
    raw = await idbGet<string>(key);
  }

  return raw === undefined ? undefined : JSON.parse(raw);
};

/**
 * Set an item in storage
 * @param key Item key
 * @param value Item value
 * @param sysnced Whether to use synced or local storage
 */
export const set = async <T>(key: string, value: T, synced: boolean) => {
  const {storage} = (await webextensionPolyfill).default;
  const raw = JSON.stringify(value);

  if (synced && storage !== undefined && storage.sync !== undefined) {
    await storage.sync.set({
      [key]: raw
    });
  } else if (!synced && storage !== undefined && storage.local !== undefined) {
    await storage.local.set({
      [key]: raw
    });
  } else {
    await idbSet(key, raw);
  }
};
