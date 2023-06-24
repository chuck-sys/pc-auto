<script setup lang="ts">
import draggable from 'vuedraggable';
import PartCard from './PartCard.vue';
import type { Part } from '../parts';

defineProps<{
  parts: Part[];
}>();

defineEmits<{
  (event: 'update:parts', newParts: Part[]): void;
}>();
</script>

<template>
  <draggable item-key="type" :list="parts" group="part">
    <template #item="{ element }">
      <PartCard :part="element" />
    </template>
  </draggable>

  <div v-show="parts.length === 0">Drag something here!</div>
</template>

<style scoped></style>
