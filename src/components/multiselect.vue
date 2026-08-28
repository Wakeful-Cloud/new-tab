<script lang="ts">
/**
 * Multiselect option
 */
export interface MultiselectOption<T> {
  /**
   * Label for the option
   */
  label: string;

  /**
   * Value for the option
   */
  value: T;
}
</script>

<script setup lang="ts" generic="T">
import {inject} from "vue";
import {FormFieldIdKey} from "~/components/form-field.vue";

// Props
const {options, onChange} = defineProps<{
  multiple: boolean;
  onChange?: (value: T) => void;
  options: MultiselectOption<T>[];
  value?: T;
}>();

// Context
const id = inject(FormFieldIdKey, undefined);

// Methods
/**
 * Option change event handler
 * @param event Change event
 */
const handleChange = (event: Event) => {
  if (onChange === undefined) {
    return;
  }

  // Get the raw value
  const raw = (event.target as HTMLSelectElement).value;

  // Find the matching option
  const option = options.find(currentOption => JSON.stringify(currentOption.value) === raw);

  if (option === undefined) {
    throw new TypeError(`[Multiselect] Could not find option for value ${raw}!`);
  }

  // Emit
  onChange(option.value);
};
</script>

<template>
  <div class="border-1 p-2 rounded-md centered-row">
    <slot name="leading" />

    <select
      class="bg-transparent cursor-pointer dark-within:focus:text-gray-500 focus-within:text-gray-400 outline-none w-full"
      :class="{
        'ml-2': $slots.leading !== undefined,
        'mr-2': $slots.trailing !== undefined,
      }"
      :id="id"
      :multiple="multiple"
      :value="JSON.stringify(value)"
      @change="handleChange"
    >
      <option
        v-for="item in options"
        :key="JSON.stringify(item.value)"
        class="bg-light-900 color-dark-900 dark:bg-dark-900 dark:color-light-900"
        :value="JSON.stringify(item.value)"
      >
        {{ item.label }}
      </option>
    </select>

    <slot name="trailing" />
  </div>
</template>
