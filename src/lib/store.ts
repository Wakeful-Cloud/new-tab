/**
 * @fileoverview State stores
 */

//Imports
import {cloneDeep} from "lodash-es";
import {createEffect, createRoot} from "solid-js";
import {createStore} from "solid-js/store";
import {get, set} from "~/lib/storage";
import {BackgroundCategory, BackgroundProvider, Settings} from "~/lib/types";

/**
 * Settings storage key
 */
const SETTINGS_STORAGE_KEY = "io.github.wakeful-clouds.new-tab.settings";

/**
 * Default settings
 */
export const defaultSettings = {
  version: import.meta.env.VERSION as string,
  background: {
    provider: BackgroundProvider.PEXELS,
    category: BackgroundCategory.NONE,
    previousIDs: [],
    refreshAfter: 1000 * 60 * 60 //1 hour
  },
  shortcuts: []
} as Settings;

/**
 * Global settings resource
 */
export const [settings, setSettings] = createStore<Settings>(
  cloneDeep(defaultSettings)
);

/**
 * Initialize the settings store
 */
export const initializeSettingsStore = async () => {
  //Get initial settings from storage
  const initialSettings = await get<Settings>(SETTINGS_STORAGE_KEY);

  if (initialSettings !== undefined) {
    setSettings(initialSettings);
  }

  //Save changes to storage
  createRoot(() => {
    createEffect(() => {
      set(SETTINGS_STORAGE_KEY, settings);
    });
  });
};
