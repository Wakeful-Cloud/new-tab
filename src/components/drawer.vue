<script setup lang="ts">
import {X} from "@lucide/vue";

// Props
const open = defineModel<boolean>("open");
</script>

<template>
  <div class="absolute bottom-0 left-0 overflow-hidden pointer-events-none right-0 top-0 z-10">
    <div
      v-if="open"
      class="absolute bg-dark-900/50 bottom-0 left-0 pointer-events-auto right-0 top-0"
      @click="open = false"
    />

    <div
      class="absolute acrylic bottom-0 duration-350 hcentered-col p-4 pointer-events-auto right-0 rounded-l-xl top-0 transition-all w-84"
      :style="open ? undefined : {right: '-84rem'}"
    >
      <div class="centered-row w-full">
        <button
          class="cursor-pointer dark:focus:text-gray-500 focus:text-gray-400 outline-none p-1"
          @click="open = false"
        >
          <X class="h-6 w-6" />
        </button>

        <div class="flex-1" />
      </div>

      <div class="centered-col h-full w-full">
        <slot />
      </div>
    </div>
  </div>
</template>
