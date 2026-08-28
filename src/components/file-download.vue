<script setup lang="ts">
import {computed} from "vue";

// Props
const {value} = defineProps<{
  filename: string;
  label: string;
  value: Blob;
}>();

// Computed
const href = computed(() => URL.createObjectURL(value));
</script>

<template>
  <a
    class="border-1 centered-row cursor-pointer dark-within:focus:text-gray-500 flex-1 focus-within:text-gray-400 p-2 rounded-md"
    :download="filename"
    :href="href"
    target="_blank"
  >
    <slot name="leading" />

    <span
      :class="{
        'ml-2': $slots.leading !== undefined,
        'mr-2': $slots.trailing !== undefined,
      }"
    >
      {{ label }}
    </span>

    <slot name="trailing" />
  </a>
</template>
