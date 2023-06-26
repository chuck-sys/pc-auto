<script setup lang="ts">
import draggable from 'vuedraggable';
import type { Song, SongPart } from '../store';
import type { Part } from '../parts';

let props = defineProps<{
  song: Song;
  k: number;
}>();

defineEmits<{
  (event: 'click-title'): void;
}>();

function onCloneSong(s: SongPart): Part {
  const songPartIndex = props.song.parts.map((p) => p.identifier).indexOf(s.identifier);

  return {
    type: 'song',
    songId: props.k,
    songPart: songPartIndex
  };
}
</script>

<template>
  <v-card>
    <v-card-title class="song-title" @click="$emit('click-title')">
      {{ song.title }}
    </v-card-title>

    <v-card-subtitle> {{ song.artist }} - {{ song.lyricist }} </v-card-subtitle>

    <v-card-actions>
      <draggable
        item-key="identifier"
        :clone="onCloneSong"
        :list="song.parts"
        :group="{ name: 'part', pull: 'clone', put: false }"
      >
        <template #item="{ element }">
          <v-chip draggable> {{ element.identifier }} ({{ element.lyricsBySlide.length }}) </v-chip>
        </template>
      </draggable>
    </v-card-actions>
  </v-card>
</template>

<style scoped>
.song-title {
  cursor: pointer;
}
</style>
