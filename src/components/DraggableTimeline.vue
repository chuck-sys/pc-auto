<script setup lang="ts">
import draggable from 'vuedraggable';
import PartCard from './PartCard.vue';
import QuickstartTemplates from './QuickstartTemplates.vue';
import type { Part } from '../parts';
import type { Template } from '../templates';

defineProps<{
  parts: Part[];
}>();

const emit = defineEmits<{
  (event: 'update:parts', newParts: Part[]): void;
}>();

function onUseTemplate(template: Template): void {
  emit('update:parts', template.parts);
}
</script>

<template>
  <draggable item-key="type" :list="parts" group="part">
    <template #item="{ element }">
      <PartCard :part="element" />
    </template>
  </draggable>

  <QuickstartTemplates
      @use-template="onUseTemplate"
      v-show="parts.length === 0" />
</template>

<style scoped></style>
