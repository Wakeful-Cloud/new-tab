/**
 * @fileoverview Storage abstraction
 */

//Imports
import {get as idbGet, set as idbSet} from "idb-keyval";

/**
 * Get an item from storage
 * @param key Item key
 * @returns Item value
 */
export const get = async <T>(key: string): Promise<T | undefined> => {
  let raw: string | undefined = undefined;

  if (typeof chrome !== "undefined" && chrome.storage !== undefined) {
    raw = (await chrome.storage.local.get(key))?.[key];
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
  const raw = JSON.stringify(value);

  if (typeof chrome !== "undefined" && chrome.storage !== undefined) {
    await chrome.storage.local.set({
      [key]: raw
    });
  } else {
    await idbSet(key, raw);
  }
};
