<script setup lang="ts">
import {inject} from "vue";
import {FormFieldIdKey} from "~/components/form-field.vue";

// Props
defineProps<{
  onChange?: (value: string) => void;
  placeholder?: string;
  type: "email" | "number" | "password" | "search" | "tel" | "text" | "url";
  value: string;
}>();

// Context
const id = inject(FormFieldIdKey, undefined);
</script>

<template>
  <div class="border-1 p-2 rounded-md centered-row">
    <slot name="leading" />

    <input
      class="bg-transparent outline-none w-full"
      :class="{
        'ml-2': $slots.leading !== undefined,
        'mr-2': $slots.trailing !== undefined,
      }"
      :id="id"
      :placeholder="placeholder"
      :type="type"
      :value="value"
      @input="onChange?.(($event.target as HTMLInputElement).value)"
    />

    <slot name="trailing" />
  </div>
</template>
