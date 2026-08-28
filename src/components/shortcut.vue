<script setup lang="ts">
import {makeDraggable} from "@vue-dnd-kit/core";
import {useTemplateRef} from "vue";
import {ShortcutLinkHint, type ShortcutMetadata} from "~/lib/types";

// Props
const {metadata, onEdit} = defineProps<{
  metadata: ShortcutMetadata;
  onEdit: () => void;
}>();

// Refs
const parent = useTemplateRef<HTMLElement>("parent");

// Composables
const {} = makeDraggable(parent, {});

// Methods
/**
 * Handle context menu event
 * @param event The context menu event
 */
const onContextMenu = (event: MouseEvent) => {
  event.preventDefault();
  onEdit();
};
</script>

<template>
  <div ref="parent">
    <a
      class="centered-col rounded-xl m-4 p-1"
      :href="metadata.link"
      rel="noopener noreferrer"
      @contextmenu="onContextMenu"
    >
      <img
        :alt="`${metadata.title} icon`"
        class="h-[14vh] w-[14vh] object-contain"
        :src="metadata.icon"
      />
      <h1 class="text-lg">{{ metadata.title }}</h1>
    </a>

    <link
      v-if="metadata.linkHint !== ShortcutLinkHint.NONE"
      :href="metadata.link"
      :rel="metadata.linkHint"
    />
  </div>
</template>
