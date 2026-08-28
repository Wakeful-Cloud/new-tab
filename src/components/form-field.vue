<script lang="ts">
import type {InjectionKey} from "vue";

/**
 * Provide/inject key for the form field ID
 */
export const FormFieldIdKey: InjectionKey<string | undefined> = Symbol("FormFieldId");
</script>

<script setup lang="ts">
import {provide, useId} from "vue";

// Props
defineProps<{
  label: string;
}>();

// State
const id = useId();

// Context
provide(FormFieldIdKey, id);
</script>

<template>
  <div class="my-1 w-full">
    <label class="text-sm" :for="id">
      {{ label }}
    </label>

    <div class="mt-0.5">
      <slot />
    </div>
  </div>
</template>
