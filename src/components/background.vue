<script setup lang="ts">
import type {BackgroundData} from "~/lib/types";

// Props
defineProps<{
  background?: BackgroundData;
}>();
</script>

<template>
  <div class="absolute bottom-0 left-0 pointer-events-none right-0 top-0">
    <div class="absolute dark:bg-dark-700 h-full object-cover w-full -z-2" />

    <img
      v-if="background !== undefined"
      :alt="`${background.alt} icon`"
      class="absolute h-full object-cover w-full -z-1"
      crossorigin="anonymous"
      referrerpolicy="no-referrer"
      :src="background.url"
    />
  </div>
</template>
