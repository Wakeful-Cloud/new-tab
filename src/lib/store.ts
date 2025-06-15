/**
 * @file State stores
 */

// Imports
import {cloneDeep} from "lodash-es";
import {createStore, StoreSetter, unwrap} from "solid-js/store";

import {get, set} from "~/lib/storage";
import {BackgroundCategory, BackgroundProvider, Store} from "~/lib/types";

/**
 * Store storage key
 */
const STORE_STORAGE_KEY = "io.github.wakeful-cloud.new-tab.store";

/**
 * Default global store value
 */
const defaultStore = {
  background: {
    category: BackgroundCategory.NONE,
    previousIDs: [],
    provider: BackgroundProvider.PEXELS,
    // 1 hour
    refreshAfter: 1000 * 60 * 60,
  },
  shortcuts: [],
  version: import.meta.env.VERSION,
} as Store;

/**
 * Global store
 */
const [store, baseSetStore] = createStore<Store>(cloneDeep(defaultStore));

export {store};

/**
 * Initialize the global store
 */
export const initializeStore = async () => {
  // Get initial value from storage
  const initial = await get<Store>(STORE_STORAGE_KEY);

  if (initial !== undefined) {
    baseSetStore(initial);
  }
};

/**
 * Set the global store
 * @param setter Store setter
 */
export const setStore = (setter: StoreSetter<Store, []>) => {
  // Update the store
  baseSetStore(setter);

  // Save
  set<Store>(STORE_STORAGE_KEY, unwrap(store));
};

/**
 * Reset the global store
 * @returns Nothing
 */
export const resetStore = () => setStore(cloneDeep(defaultStore));
