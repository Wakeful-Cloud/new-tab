/**
 * @file State stores
 */

import {defineStore} from "pinia";
import {ref, watch} from "vue";

import {type Settings, BackgroundCategory, BackgroundProvider} from "~/lib/types";

/**
 * Settings storage key
 */
const SETTINGS_STORAGE_KEY = "io.github.wakeful-cloud.new-tab.settings";

/**
 * Settings store
 */
export const useSettingStore = defineStore("settings", () => {
  // Constants
  const defaultSettings = {
    background: {
      category: BackgroundCategory.NONE,
      previousIDs: [],
      provider: BackgroundProvider.PEXELS,
      // 1 hour
      refreshAfter: 1000 * 60 * 60,
    },
    shortcuts: [],
    version: import.meta.env.VERSION,
  } as Settings;

  // Refs
  // oxlint-disable-next-line typescript/no-invalid-void-type
  const {resolve: settingsLoaded} = Promise.withResolvers<void>();
  const settings = ref(structuredClone(defaultSettings));
  const test = ref(0);

  // Methods
  /**
   * Sets the settings to the given value
   * @param newSettings The new settings to set
   */
  const setSettings = (newSettings: Settings) => {
    settings.value = newSettings;
  };

  /**
   * Resets the settings to the default value
   */
  const resetSettings = () => {
    settings.value = structuredClone(defaultSettings);
  };

  // Effects
  watch(settings, async newSettings => {
    // Wait for the settings to load before saving
    await settingsLoaded;

    // Serialize the settings to JSON
    const serializedSettings = JSON.stringify(newSettings);

    if (typeof browser !== "undefined" && browser.storage !== undefined) {
      // Save the settings to local storage
      await browser.storage.local.set({[SETTINGS_STORAGE_KEY]: serializedSettings});
    } else {
      // Save the settings to local storage
      globalThis.localStorage.setItem(SETTINGS_STORAGE_KEY, serializedSettings);
    }
  });

  // Lifecycle hooks
  (async () => {
    if (typeof browser !== "undefined" && browser.storage !== undefined) {
      // Load the settings from local storage
      const data = await browser.storage.local.get(SETTINGS_STORAGE_KEY);
      if (data[SETTINGS_STORAGE_KEY] !== undefined) {
        settings.value = data[SETTINGS_STORAGE_KEY];
      }
    } else {
      // Load the settings from local storage
      const data = globalThis.localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (data !== null) {
        settings.value = JSON.parse(data);
      }
    }

    // Resolve the settings loaded promise
    settingsLoaded();
  })();

  return {
    resetSettings,
    setSettings,
    settings,
    settingsLoaded,
    test,
  };
});
