<script setup lang="ts">
import {Image, Lightbulb, Link, Save, Trash2, Type} from "@lucide/vue";
import {capitalize} from "es-toolkit";
import {computed, ref, watch} from "vue";
import Button from "~/components/button.vue";
import FileUpload from "~/components/file-upload.vue";
import FormField from "~/components/form-field.vue";
import Multiselect, {type MultiselectOption} from "~/components/multiselect.vue";
import SubmitButton from "~/components/submit-button.vue";
import TextBox from "~/components/text-box.vue";
import {ShortcutLinkHint, type ShortcutMetadata} from "~/lib/types";
import {createDataURL} from "~/lib/utils";

// Props
const {metadata, onSave} = defineProps<{
  metadata?: ShortcutMetadata;
  onDelete: () => void;
  onSave: (metadata: ShortcutMetadata) => void;
}>();

// Refs
const title = ref("");
const icon = ref("");
const link = ref("");
const linkHint = ref(ShortcutLinkHint.NONE);

// Computed
const linkHintOptions = computed(() =>
  Object.values(ShortcutLinkHint).map(
    provider =>
      ({
        label: capitalize(provider),
        value: provider,
      }) as MultiselectOption<ShortcutLinkHint>,
  ),
);

// Methods
/**
 * Handle title change
 * @param value The new title value
 */
const onTitleChange = (value: string) => {
  title.value = value;
};

/**
 * Handle link change
 * @param value The new link value
 */
const onLinkChange = (value: string) => {
  link.value = value;
};

/**
 * Handle link hint change
 * @param value The new link hint value
 */
const onLinkHintChange = (value: ShortcutLinkHint) => {
  linkHint.value = value;
};

/**
 * Handle icon change
 * @param files The new icon files
 */
const onIconChange = async (files: File[]) => {
  if (files.length !== 1) {
    throw new Error(`Expected 1 file, got ${files.length}!`);
  }

  const iconURL = await createDataURL(files[0]!);
  icon.value = iconURL;
};

/**
 * Handle form submission
 * @param event The form submission event
 */
const onSaveForm = (event: Event) => {
  event.preventDefault();

  // Get the ID
  let id = metadata?.id;

  if (id === undefined) {
    const random = new Uint32Array(10);
    globalThis.crypto.getRandomValues(random);

    id = [...random].map(number => number.toString(16).padStart(2, "0")).join("");
  }

  onSave({
    icon: icon.value,
    id,
    link: link.value,
    linkHint: linkHint.value,
    title: title.value,
  });
};

// Effects
watch(
  () => metadata,
  currentMetadata => {
    if (currentMetadata !== undefined) {
      title.value = currentMetadata.title;
      icon.value = currentMetadata.icon;
      link.value = currentMetadata.link;
      linkHint.value = currentMetadata.linkHint;
    }
  },
  {
    immediate: true,
  },
);
</script>

<template>
  <div class="centered-col flex-1">
    <form @submit="onSaveForm">
      <FormField label="Title">
        <TextBox
          :on-change="onTitleChange"
          placeholder="My Awesome Website"
          type="text"
          :value="title"
        >
          <template #leading>
            <Type />
          </template>
        </TextBox>
      </FormField>

      <FormField label="Icon">
        <FileUpload
          :accept="['image/*']"
          label="Upload Image"
          :multiple="false"
          :on-upload="onIconChange"
        >
          <template #leading>
            <Image />
          </template>
        </FileUpload>
      </FormField>

      <FormField label="URL">
        <TextBox
          :on-change="onLinkChange"
          placeholder="https://example.com"
          type="text"
          :value="link"
        >
          <template #leading>
            <Link />
          </template>
        </TextBox>
      </FormField>

      <FormField label="Link Hint">
        <Multiselect
          :multiple="false"
          :on-change="onLinkHintChange"
          :options="linkHintOptions"
          :value="linkHint"
        >
          <template #leading>
            <Lightbulb />
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

    <Button label="Delete" :on-click="onDelete">
      <template #leading>
        <Trash2 />
      </template>
    </Button>
  </div>
</template>
