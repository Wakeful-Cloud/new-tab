<script setup lang="ts">
import { makeDroppable, type IDragEvent } from "@vue-dnd-kit/core";
import { onBeforeUnmount, ref, useTemplateRef, watch } from "vue";
import Shortcut from "~/components/shortcut.vue";
import type { ShortcutMetadata } from "~/lib/types";

// Props
const {items, onEdit, onReorder} = defineProps<{
  items: ShortcutMetadata[];
  onEdit: (metadata: ShortcutMetadata) => void;
  onReorder: (shortcuts: ShortcutMetadata[]) => void;
}>();

// State
let hoverTimer: number | undefined = undefined;
let pendingHover: {draggedID: string; hoveredID: string} | undefined = undefined;

// Refs
const list = useTemplateRef<HTMLElement>("list");
const shortcuts = ref(items);
const dropped = ref(false);

// Methods
/**
 * Apply a pending hover reorder.
 */
const applyHoverReorder = () => {
  if (pendingHover === undefined) {
    return;
  }

  const {draggedID, hoveredID} = pendingHover;
  pendingHover = undefined;

  const sourceIndex = shortcuts.value.findIndex(item => item.id === draggedID);
  const targetIndex = shortcuts.value.findIndex(item => item.id === hoveredID);

  if (sourceIndex === -1 || targetIndex === -1 || sourceIndex === targetIndex) {
    return;
  }

  const reordered = [...shortcuts.value];
  const [shortcut] = reordered.splice(sourceIndex, 1);

  if (shortcut === undefined) {
    return;
  }

  reordered.splice(targetIndex, 0, shortcut);
  shortcuts.value = reordered;
};

/**
 * Cancel a queued hover reorder.
 */
const clearHoverReorder = () => {
  if (hoverTimer !== undefined) {
    clearTimeout(hoverTimer);
    hoverTimer = undefined;
  }

  pendingHover = undefined;
};

/**
 * Commit the previewed list order after a drop.
 */
const onDrop = () => {
  if (hoverTimer !== undefined) {
    clearTimeout(hoverTimer);
    hoverTimer = undefined;
  }
  applyHoverReorder();

  dropped.value = true;
  onReorder(shortcuts.value);
};

/**
 * Prepare to track whether the drag ends over the shortcut list.
 */
const onDragStart = () => {
  clearHoverReorder();
  dropped.value = false;
};

/**
 * Restore persisted order when a drag is cancelled.
 */
const onDragCancel = () => {
  clearHoverReorder();
  shortcuts.value = items;
};

/**
 * Restore persisted order when the shortcut is released outside the list.
 */
const onDragEnd = () => {
  clearHoverReorder();

  if (!dropped.value) {
    shortcuts.value = items;
  }
};

/**
 * Move a shortcut aside as the dragged shortcut passes it.
 * @param hoveredID The hovered shortcut ID
 * @param event The drag event
 */
const onHover = (hoveredID: string, event: IDragEvent) => {
  const dragged = event.draggedItems[0]?.item as ShortcutMetadata | undefined;

  if (dragged === undefined) {
    return;
  }

  pendingHover = {draggedID: dragged.id, hoveredID};

  if (hoverTimer !== undefined) {
    clearTimeout(hoverTimer);
  }

  hoverTimer = setTimeout(() => {
    hoverTimer = undefined;
    applyHoverReorder();
  }, 125) as unknown as number;
};

// Composables
makeDroppable(list, {events: {onDrop}, groups: ["shortcuts"]}, () => shortcuts.value);

// Effects
watch(
  () => items,
  newItems => {
    shortcuts.value = newItems;
  },
);

// Lifecycle hooks
onBeforeUnmount(clearHoverReorder);
</script>

<template>
  <div ref="list">
    <TransitionGroup
      class="centered-row flex-wrap m-12"
      move-class="transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]"
      tag="div"
    >
      <Shortcut
        v-for="(item, index) in shortcuts"
        :key="item.id"
        :index="index"
        :items="shortcuts"
        :metadata="item"
        :on-drag-cancel="onDragCancel"
        :on-drag-end="onDragEnd"
        :on-drag-start="onDragStart"
        :on-edit="() => onEdit(item)"
        :on-hover="event => onHover(item.id, event)"
      />
    </TransitionGroup>
  </div>
</template>
