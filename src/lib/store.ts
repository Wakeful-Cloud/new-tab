/**
 * @fileoverview State stores
 */

//Imports
import {cloneDeep} from "lodash-es";
import {StoreSetter, createStore, unwrap} from "solid-js/store";
import {get, set} from "~/lib/storage";
import {BackgroundCategory, BackgroundProvider, Store} from "~/lib/types";

/**
 * Store storage key
 */
const STORE_STORAGE_KEY = "io.github.wakeful-clouds.new-tab.store";

/**
 * Default global store value
 */
const defaultStore = {
  version: import.meta.env.VERSION as string,
  background: {
    provider: BackgroundProvider.PEXELS,
    category: BackgroundCategory.NONE,
    previousIDs: [],
    refreshAfter: 1000 * 60 * 60 //1 hour
  },
  shortcuts: []
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
  //Get initial value from storage
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
  //Update the store
  baseSetStore(setter);

  //Save
  set<Store>(STORE_STORAGE_KEY, unwrap(store));
};

/**
 * Reset the global store
 */
export const resetStore = () => setStore(cloneDeep(defaultStore));
