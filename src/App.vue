<script setup lang="ts">
import { reactive } from 'vue';
import TabbedDragDrop from './components/TabbedDragDrop.vue';
import type { Song, PresentationConfig } from './store';

let saveData: PresentationConfig = reactive({
  presentationDate: new Date(),
  fontSize: 48,
  parts: [],
  scriptures: [],
  songs: []
});

function onCreateSong(song: Song) {
  saveData.songs.push(song);
}
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="5">
        <TabbedDragDrop
          @create:song="onCreateSong"
          :songs="saveData.songs"
          :scriptures="saveData.scriptures"
        />
      </v-col>

      <v-col cols="12" sm="2"> </v-col>

      <v-col cols="12" sm="5"> </v-col>
    </v-row>
  </v-container>
</template>

<style scoped></style>
