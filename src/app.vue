<script setup lang="ts">
import {Image, RefreshCw, Settings} from "@lucide/vue";
import {DnDProvider} from "@vue-dnd-kit/core";
import {capitalize} from "es-toolkit";
import {computed, onBeforeUnmount, onMounted, ref, watchEffect} from "vue";

import Background from "~/components/background.vue";
import Drawer from "~/components/drawer.vue";
import GeneralMode from "~/components/general-mode.vue";
import ShortcutMode from "~/components/shortcut-mode.vue";
import Shortcut from "~/components/shortcut.vue";
import {generateBackground} from "~/lib/background";
import {useSettingStore} from "~/lib/store";
import {BackgroundProvider, type ShortcutMetadata} from "~/lib/types";

/**
 * Drawer view modes
 */
enum DrawerMode {
  /**
   * General settings and information
   */
  GENERAL = "general",

  /**
   * Upsert a shortcut
   */
  SHORTCUT = "shortcut",
}

// Constants
const darkQuery = globalThis.matchMedia("(prefers-color-scheme: dark)");

// Store
const settingStore = useSettingStore();

// Refs
const dark = ref(darkQuery.matches);
const drawerOpen = ref(false);
const drawerMode = ref(DrawerMode.GENERAL);
const shortcut = ref<ShortcutMetadata>();
const shortcutKey = ref(0);

// Computed
const currentBackground = computed(() => settingStore.settings.background.background);
const creditTag = computed(() =>
  settingStore.settings.background.background?.link === undefined ? "p" : "a",
);
const formattedProvider = computed(() => capitalize(settingStore.settings.background.provider));

// Methods
/**
 * Listen for changes to the dark mode preference
 * @param event The media query event
 */
const darkListener = (event: MediaQueryListEvent) => {
  dark.value = event.matches;
};

/**
 * Open the settings drawer
 */
const onOpenSettings = () => {
  drawerMode.value = DrawerMode.GENERAL;
  drawerOpen.value = true;
};

/**
 * Refresh the background image
 */
const onRefreshBackground = async () => {
  await generateBackground();
};

/**
 * Edit a shortcut
 * @param metadata The shortcut metadata to edit
 */
const onEdit = (metadata: ShortcutMetadata) => {
  // Force-refresh the shortcut metadata to prevent the ShortcutMode from displaying stale data
  shortcut.value = undefined;
  shortcut.value = metadata;
  shortcutKey.value++;

  drawerMode.value = DrawerMode.SHORTCUT;
  drawerOpen.value = true;
};

/**
 * Create a new shortcut
 */
const onCreateShortcut = () => {
  shortcut.value = undefined;
  shortcutKey.value++;

  drawerMode.value = DrawerMode.SHORTCUT;
  drawerOpen.value = true;
};

/**
 * Save a shortcut
 * @param metadata The shortcut metadata to save
 */
const onMetadataSave = (metadata: ShortcutMetadata) => {
  // Generate shortcuts
  const shortcuts: ShortcutMetadata[] = [];

  let overwroteMetadata = false;

  for (const storeShortcut of settingStore.settings.shortcuts) {
    if (storeShortcut.id === metadata.id) {
      overwroteMetadata = true;
      shortcuts.push(metadata);
    } else {
      shortcuts.push(storeShortcut);
    }
  }

  if (!overwroteMetadata) {
    shortcuts.push(metadata);
  }

  // Update global store
  settingStore.setSettings({
    ...settingStore.settings,
    shortcuts,
  });

  // Close
  drawerOpen.value = false;
};

/**
 * Delete a shortcut
 */
const onMetadataDelete = () => {
  // Generate shortcuts
  const currentShortcut = shortcut.value;

  const shortcuts = settingStore.settings.shortcuts.filter(
    existing => existing.id !== currentShortcut?.id,
  );

  // Update global store
  settingStore.setSettings({
    ...settingStore.settings,
    shortcuts,
  });

  // Close
  drawerOpen.value = false;
};

// Effects
watchEffect(() => {
  document.documentElement.classList.toggle("dark", dark.value);
});

// Lifecycle hooks
onMounted(async () => {
  // Listen for changes to the dark mode preference
  darkQuery.addEventListener("change", darkListener);

  // Wait for the persisted settings to load
  await settingStore.settingsLoaded;

  // Generate the background
  const {background} = settingStore.settings;

  if (
    // No existing background
    background.background === undefined ||
    // Background has expired
    (background.refreshAfter > 0 &&
      Date.now() - new Date(background.background.generatedAt).getTime() > background.refreshAfter)
  ) {
    await generateBackground();
  }
});

onBeforeUnmount(() => {
  // Stop listening for changes to the dark mode preference
  darkQuery.removeEventListener("change", darkListener);
});
</script>

<template>
  <button
    aria-label="Open settings"
    class="absolute acrylic cursor-pointer p-2 right-2 rounded-full top-2"
    @click="onOpenSettings"
  >
    <Settings class="h-6 w-6" />
  </button>

  <button
    aria-label="Manually refresh background"
    class="absolute acrylic bottom-2 cursor-pointer p-2 right-2 rounded-full"
    @click="onRefreshBackground"
  >
    <RefreshCw class="h-6 w-6" />
  </button>

  <DnDProvider class="centered-row flex-wrap m-12">
    <Shortcut
      v-for="item in settingStore.settings.shortcuts"
      :key="item.id"
      :metadata="item"
      :on-edit="() => onEdit(item)"
    />
  </DnDProvider>

  <component
    v-if="currentBackground?.photographerName !== undefined"
    :is="creditTag"
    :href="currentBackground?.link"
    class="absolute acrylic bottom-2 centered-row px-1.5 py-1 left-2 rounded-md text-sm"
    rel="noopener noreferrer"
  >
    <Image />
    <span class="ml-1">
      {{ currentBackground?.photographerName }}
      <span v-if="settingStore.settings.background.provider !== BackgroundProvider.CUSTOM">
        via {{ formattedProvider }}
      </span>
    </span>
  </component>

  <Drawer v-model:open="drawerOpen">
    <GeneralMode v-if="drawerMode === DrawerMode.GENERAL" :on-create-shortcut="onCreateShortcut" />

    <ShortcutMode
      v-else
      :key="shortcutKey"
      :metadata="shortcut"
      :on-delete="onMetadataDelete"
      :on-save="onMetadataSave"
    />
  </Drawer>

  <Background :background="settingStore.settings.background.background" />
</template>
