<script setup lang="ts">
import { installedTemplates } from '../templates';
import type { Template } from '../templates';

defineEmits<{
  (event: 'use-template', template: Template): void;
  (event: 'click-template-options', template: Template): void;
}>();
</script>

<template>
  <v-container>
    <v-card v-for="(template, i) in installedTemplates" :key="i">
      <v-card-title class="template-name">{{ template.name }}</v-card-title>
      <v-card-text>{{ template.description }}</v-card-text>
      <v-card-actions>
        <v-btn @click="$emit('click-template-options', template)">Options</v-btn>
        <v-btn @click="$emit('use-template', template)">Use</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<style scoped></style>
