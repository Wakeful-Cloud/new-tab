<script setup lang="ts">
// Props
defineProps<{
  label: string;
  onClick: () => void;
}>();
</script>

<template>
  <button
    class="border-1 centered-row cursor-pointer dark-within:focus:text-gray-500 focus-within:text-gray-400 my-1 outline-none p-2 rounded-md w-full"
    @click="onClick"
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
  </button>
</template>
