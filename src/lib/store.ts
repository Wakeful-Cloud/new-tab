/**
 * @fileoverview State stores
 */

//Imports
import {cloneDeep, merge} from "lodash-es";
import {createEffect, createRoot} from "solid-js";
import {createStore} from "solid-js/store";
import {get, set} from "~/lib/storage";
import {
  BackgroundCategory,
  BackgroundProvider,
  LocalStore,
  Store,
  SyncedStore
} from "~/lib/types";

/**
 * Local storage key
 */
const LOCAL_STORAGE_KEY = "io.github.wakeful-clouds.new-tab.local";

/**
 * Synced storage key
 */
const SYNCED_STORAGE_KEY = "io.github.wakeful-clouds.new-tab.synced";

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
  backgroundCache: {},
  shortcuts: []
} as Store;

/**
 * Global store
 */
export const [store, setStore] = createStore<Store>(cloneDeep(defaultStore));

/**
 * Reset the global store
 */
export const resetStore = () => setStore(cloneDeep(defaultStore));

/**
 * Initialize the global store
 */
export const initializeStore = async () => {
  //Get initial values from storage
  const initialLocal = await get<LocalStore>(LOCAL_STORAGE_KEY, false);
  const initialSync = await get<SyncedStore>(SYNCED_STORAGE_KEY, true);

  if (initialLocal !== undefined && initialLocal) {
    setStore(merge({}, initialLocal, initialSync));
  }

  //Save changes to storage
  createRoot(() => {
    createEffect(() => {
      (async () => {
        await set<LocalStore>(
          LOCAL_STORAGE_KEY,
          {
            backgroundCache: store.backgroundCache
          },
          false
        );

        await set<SyncedStore>(
          SYNCED_STORAGE_KEY,
          {
            version: store.version,
            background: store.background,
            shortcuts: store.shortcuts
          },
          true
        );
      })();
    });
  });
};
