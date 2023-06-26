<script setup lang="ts">
import { inject } from 'vue';
import type { Part } from '../parts';
import type { Song } from '../store';
defineProps<{
  part: Part;
}>();
defineEmits<{
  (event: 'select'): void;
}>();

const songs: Song[] = inject('songs', []);
</script>

<template>
  <v-card v-if="part.type === 'welcome'">
    <v-card-title>Welcome</v-card-title>
  </v-card>
  <v-card v-else-if="part.type === 'song'">
    <v-card-title>{{ songs[part.songId].title }}</v-card-title>
    <v-card-actions>{{ songs[part.songId].parts[part.songPart].identifier }}</v-card-actions>
  </v-card>
  <v-card v-else>
    <v-card-title>{{ part.type }}</v-card-title>
  </v-card>
</template>

<style scoped></style>
