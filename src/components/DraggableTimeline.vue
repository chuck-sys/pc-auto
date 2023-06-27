<script setup lang="ts">
import draggable from 'vuedraggable';
import PartCard from './PartCard.vue';
import QuickstartTemplates from './QuickstartTemplates.vue';
import type { Part } from '../parts';
import type { Template } from '../templates';

defineProps<{
  parts: Part[];
}>();

defineEmits<{
  (event: 'update:parts', newParts: Part[]): void;
  (event: 'preview-template', template: Template): void;
}>();
</script>

<template>
  <draggable item-key="type" :modelValue="parts" group="part">
    <template #item="{ element }">
      <PartCard :part="element" />
    </template>
  </draggable>

  <QuickstartTemplates
    @preview-template="$emit('preview-template', $event)"
    @use-template="$emit('update:parts', $event.parts)"
    v-show="parts.length === 0"
  />
</template>

<style scoped></style>
