<script setup lang="ts">
import type { Song } from '../store';

defineProps<{
  song: Song;
}>();

defineEmits<{
  (event: 'click-title'): void;
}>();
</script>

<template>
  <v-card>
    <v-card-title @click="$emit('click-title')">
      {{ song.title }}
    </v-card-title>

    <v-card-subtitle> {{ song.artist }} - {{ song.lyricist }} </v-card-subtitle>

    <v-card-actions>
      <v-chip v-for="(part, i) in song.parts" :key="i">
        {{ part.identifier }} ({{ part.lyricsBySlide.length }})
      </v-chip>
    </v-card-actions>
  </v-card>
</template>

<style scoped></style>
