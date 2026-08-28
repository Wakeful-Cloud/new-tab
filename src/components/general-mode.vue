<script setup lang="ts">
import {Clock, Download, Filter, Globe, Image, Plus, RefreshCw, Save, Upload} from "@lucide/vue";
import {capitalize} from "es-toolkit";
import {computed, ref, watch} from "vue";

import Button from "~/components/button.vue";
import FileDownload from "~/components/file-download.vue";
import FileUpload from "~/components/file-upload.vue";
import FormField from "~/components/form-field.vue";
import Multiselect, {type MultiselectOption} from "~/components/multiselect.vue";
import SubmitButton from "~/components/submit-button.vue";
import {generateBackground} from "~/lib/background";
import {useSettingStore} from "~/lib/store";
import {BackgroundCategory, BackgroundProvider} from "~/lib/types";
import {createDataURL} from "~/lib/utils";

// Constants
const refreshAfterOptions: MultiselectOption<number>[] = [
  {
    label: "15 Minutes",
    value: 1000 * 60 * 10,
  },
  {
    label: "30 Minutes",
    value: 1000 * 60 * 30,
  },
  {
    label: "1 Hour",
    value: 1000 * 60 * 60,
  },
  {
    label: "3 Hours",
    value: 1000 * 60 * 60 * 3,
  },
  {
    label: "6 Hours",
    value: 1000 * 60 * 60 * 6,
  },
  {
    label: "12 Hours",
    value: 1000 * 60 * 60 * 12,
  },
  {
    label: "1 Day",
    value: 1000 * 60 * 60 * 24,
  },
  {
    label: "7 Days",
    value: 1000 * 60 * 60 * 24 * 7,
  },
  {
    label: "Never",
    value: -1,
  },
];
const version = import.meta.env.VERSION;

// Props
defineProps<{
  onCreateShortcut: () => void;
}>();

// Refs
const category = ref<BackgroundCategory>(BackgroundCategory.NONE);
const customBackground = ref<string>();
const provider = ref<BackgroundProvider>(BackgroundProvider.PEXELS);
const refreshAfter = ref(0);

// Stores
const settingStore = useSettingStore();

// Computed
const backgroundProviderOptions = computed(() =>
  Object.values(BackgroundProvider).map(
    backgroundProvider =>
      ({
        label: capitalize(backgroundProvider),
        value: backgroundProvider,
      }) as MultiselectOption<BackgroundProvider>,
  ),
);

const backgroundCategoryOptions = computed(() =>
  Object.values(BackgroundCategory).map(
    backgroundCategory =>
      ({
        label: capitalize(backgroundCategory),
        value: backgroundCategory,
      }) as MultiselectOption<BackgroundCategory>,
  ),
);

const serializedSettings = computed(() => {
  const raw = JSON.stringify(settingStore.settings, undefined, 2);

  const blob = new Blob([raw], {
    type: "application/json",
  });

  return blob;
});

// Methods
/**
 * Handle background provider change
 * @param value The new background provider
 */
const onProviderChange = (value: BackgroundProvider) => {
  provider.value = value;
};

/**
 * Handle background category change
 * @param value The new background category
 */
const onCategoryChange = (value: BackgroundCategory) => {
  category.value = value;
};

/**
 * Handle refresh after change
 * @param value The new refresh after value
 */
const onRefreshAfterChange = (value: number) => {
  refreshAfter.value = value;
};

/**
 * Handle custom background upload
 * @param files
 */
const onUploadCustomBackground = async (files: File[]) => {
  if (files.length !== 1) {
    throw new Error(`Expected 1 file, got ${files.length}!`);
  }

  // Convert to a data URL
  const dataURL = await createDataURL(files[0]!);

  // Update the background
  customBackground.value = dataURL;
};

/**
 * Handle save settings
 * @param event The submit event
 */
const onSaveSettings = async (event: Event) => {
  event.preventDefault();

  // Update store
  settingStore.setSettings({
    ...settingStore.settings,
    background: {
      ...settingStore.settings.background,
      category: category.value,
      provider: provider.value,
      refreshAfter: refreshAfter.value,
    },
  });

  // Regenerate background
  await generateBackground(customBackground.value);
};

/**
 * Handle reset settings
 */
const onResetSettings = async () => {
  // Reset store
  settingStore.resetSettings();

  // Regenerate background
  await generateBackground();
};

/**
 * Handle upload settings
 * @param files
 */
const onUploadSettings = async (files: File[]) => {
  if (files.length !== 1) {
    throw new Error(`Expected 1 file, got ${files.length}!`);
  }

  // Parse the file
  const raw = await files[0]!.text();
  const deserialized = JSON.parse(raw);

  // Update store
  settingStore.setSettings(deserialized);
};

// Effects
watch(
  () => settingStore.settings.background,
  background => {
    if (background.category !== undefined) {
      category.value = background.category;
    }

    provider.value = background.provider;
    refreshAfter.value = background.refreshAfter;
  },
  {
    immediate: true,
  },
);
</script>

<template>
  <div class="w-full">
    <h1 class="font-medium text-center text-xl">Shortcuts</h1>

    <Button label="Create Shortcut" :on-click="onCreateShortcut">
      <template #leading>
        <Plus />
      </template>
    </Button>
  </div>

  <div class="my-2 w-full" />

  <form class="centered-col w-full" @submit="onSaveSettings">
    <h1 class="font-medium text-center text-xl w-full">Background</h1>

    <FormField label="Background provider">
      <Multiselect
        :multiple="false"
        :on-change="onProviderChange"
        :options="backgroundProviderOptions"
        :value="settingStore.settings.background.provider"
      >
        <template #leading>
          <Globe />
        </template>
      </Multiselect>
    </FormField>

    <FormField v-if="provider === BackgroundProvider.CUSTOM" label="Upload custom background">
      <FileUpload
        :accept="['image/*']"
        label="Upload Image"
        :multiple="false"
        :on-upload="onUploadCustomBackground"
      >
        <template #leading>
          <Image />
        </template>
      </FileUpload>
    </FormField>

    <FormField label="Background category">
      <Multiselect
        :multiple="false"
        :on-change="onCategoryChange"
        :options="backgroundCategoryOptions"
        :value="settingStore.settings.background.category"
      >
        <template #leading>
          <Filter />
        </template>
      </Multiselect>
    </FormField>

    <FormField label="Refresh Background After">
      <Multiselect
        :multiple="false"
        :on-change="onRefreshAfterChange"
        :options="refreshAfterOptions"
        :value="settingStore.settings.background.refreshAfter"
      >
        <template #leading>
          <Clock />
        </template>
      </Multiselect>
    </FormField>

    <FormField label="Save Settings">
      <SubmitButton label="Save">
        <template #leading>
          <Save />
        </template>
      </SubmitButton>
    </FormField>
  </form>

  <div class="my-2 w-full" />

  <div class="w-full">
    <h1 class="font-medium text-center text-xl">Miscellaneous</h1>

    <Button label="Reset Settings" :on-click="onResetSettings">
      <template #leading>
        <RefreshCw />
      </template>
    </Button>

    <div class="py-1">
      <FileDownload filename="new-tab.json" label="Download Settings" :value="serializedSettings">
        <template #leading>
          <Download />
        </template>
      </FileDownload>
    </div>

    <div class="py-1">
      <FileUpload
        :accept="['application/json', '.json']"
        label="Upload Settings"
        :multiple="false"
        :on-upload="onUploadSettings"
      >
        <template #leading>
          <Upload />
        </template>
      </FileUpload>
    </div>
  </div>

  <div class="my-2 w-full" />

  <p class="w-full text-center">
    Version: {{ version }}
    <br />
    Built with ❤️ by
    <a href="https://wakefulcloud.dev" rel="noopener noreferrer"> Wakeful Cloud </a>
  </p>
</template>
