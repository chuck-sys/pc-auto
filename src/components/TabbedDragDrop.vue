<script setup lang="ts">
import { ref } from 'vue';
import SongCard from './SongCard.vue';
import SongDialogue from './SongDialogue.vue';
import type { Song, Scripture } from '../store';

let showSongDialog = ref(false);

defineProps<{
  songs: Song[];
  scriptures: Scripture[];
}>();
let emit = defineEmits<{
  (event: 'create:song', newSong: Song): void;
  (event: 'update:scriptures', newValue: Scripture[]): void;
}>();

let tab = ref('liturgy');

function onCreateSong(song: Song) {
  emit('create:song', song);
}
</script>

<template>
  <v-card>
    <v-tabs v-model="tab">
      <v-tab value="liturgy">Liturgy</v-tab>
      <v-tab value="songs">Songs</v-tab>
      <v-tab value="scripture">Scripture</v-tab>
    </v-tabs>
    <v-card-text>
      <v-window v-model="tab">
        <v-window-item value="liturgy"> </v-window-item>
        <v-window-item value="songs">
          <v-btn @click="showSongDialog = true" prepend-icon="$plus" variant="tonal"> Song </v-btn>

          <SongCard v-for="(song, i) in songs" :key="i" :song="song" />
        </v-window-item>
        <v-window-item value="scripture">
          <v-btn prepend-icon="$plus" variant="tonal"> Scripture </v-btn>
        </v-window-item>
      </v-window>
    </v-card-text>
  </v-card>

  <SongDialogue
    @create:song="onCreateSong"
    v-model:dialog="showSongDialog"
    :is-editing-existing-song="false"
  />
</template>

<style scoped></style>
