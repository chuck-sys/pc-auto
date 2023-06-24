<script setup lang="ts">
import { reactive, provide } from 'vue';
import TabbedDragDrop from './components/TabbedDragDrop.vue';
import DraggableTimeline from './components/DraggableTimeline.vue';
import type { Song, PresentationConfig } from './store';

let saveData: PresentationConfig = reactive({
  presentationDate: new Date(),
  fontSize: 48,
  parts: [],
  scriptures: [],
  songs: []
});

provide('songs', saveData.songs);
provide('scriptures', saveData.scriptures);

function onCreateSong(song: Song) {
  saveData.songs.push(song);
}

function onUpdateSong(i: number, newSong: Song) {
  saveData.songs[i] = newSong;
}

function onDeleteSong(i: number) {
  saveData.songs.splice(i, 1);
}
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="5">
        <TabbedDragDrop
          @create:song="onCreateSong"
          @update:song="onUpdateSong"
          @delete:song="onDeleteSong"
          :songs="saveData.songs"
          :scriptures="saveData.scriptures"
        />
      </v-col>

      <v-col cols="12" sm="2">
        <DraggableTimeline v-model:parts="saveData.parts" />
      </v-col>

      <v-col cols="12" sm="5"> </v-col>
    </v-row>
  </v-container>
</template>

<style scoped></style>
