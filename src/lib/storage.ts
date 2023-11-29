/**
 * @fileoverview Storage abstraction
 */

//Imports
import {get as idbGet, set as idbSet} from "idb-keyval";
import {storage} from "webextension-polyfill";

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
  let raw: string | undefined = undefined;

  if (synced && typeof storage.sync !== "undefined") {
    raw = (await storage.sync.get(key))?.[key];
  } else if (!synced && typeof storage.local !== "undefined") {
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
  const raw = JSON.stringify(value);

  if (synced && typeof storage.sync !== "undefined") {
    await storage.local.set({
      [key]: raw
    });
  } else if (!synced && typeof storage.local !== "undefined") {
    await storage.local.set({
      [key]: raw
    });
  } else {
    await idbSet(key, raw);
  }
};
