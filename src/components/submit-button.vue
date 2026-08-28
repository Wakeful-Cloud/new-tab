<script setup lang="ts">
import {inject} from "vue";
import {FormFieldIdKey} from "~/components/form-field.vue";

// Props
defineProps<{
  label: string;
}>();

// Context
const id = inject(FormFieldIdKey, undefined);
</script>

<template>
  <label
    class="border-1 centered-row cursor-pointer dark-within:focus:text-gray-500 focus-within:text-gray-400 my-2 p-2 rounded-md w-full"
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

    <input class="h-0 w-0" :id="id" type="submit" />

    <slot name="trailing" />
  </label>
</template>
