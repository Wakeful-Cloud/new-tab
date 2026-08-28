<script setup lang="ts">
import {inject, ref} from "vue";
import {FormFieldIdKey} from "~/components/form-field.vue";

// Props
const {onUpload} = defineProps<{
  accept?: string[];
  label: string;
  multiple: boolean;
  onUpload?: (value: File[]) => void;
}>();

// Context
const id = inject(FormFieldIdKey, undefined);

// Refs
const filenames = ref<string[]>([]);

// Methods
/**
 * File input change event handler
 * @param event Change event
 */
const onChange = (event: Event) => {
  if (onUpload === undefined) {
    return;
  }

  // Get the target
  const file = event.target as HTMLInputElement;

  // Get files
  if (file.files === null) {
    throw new TypeError("File list is null");
  }

  const files = [...file.files];

  // Update the filenames
  filenames.value = files.map(currentFile => currentFile.name);

  // Emit
  onUpload(files);
};
</script>

<template>
  <label
    class="border-1 centered-row cursor-pointer dark-within:focus:text-gray-500 flex-1 focus-within:text-gray-400 p-2 rounded-md"
  >
    <slot name="leading" />

    <span
      :class="{
        'ml-2': $slots.leading !== undefined,
        'mr-2': $slots.trailing !== undefined,
      }"
    >
      {{ label }} {{ filenames.join(", ") }}
    </span>

    <input
      :accept="accept?.join(',')"
      :aria-label="label"
      class="h-0 w-0"
      :id="id"
      :multiple="multiple"
      type="file"
      @change="onChange"
    />

    <slot name="trailing" />
  </label>
</template>
