<script setup lang="ts">
import { ref } from 'vue';
import DraggableSongCard from './DraggableSongCard.vue';
import CreateSongDialog from './CreateSongDialog.vue';
import EditSongDialog from './EditSongDialog.vue';
import type { Song, Scripture } from '../store';

let showCreateSongDialog = ref(false);
let showEditSongDialog = ref(false);
let editingIndex = ref(0);

defineProps<{
  songs: Song[];
  scriptures: Scripture[];
}>();
let emit = defineEmits<{
  (event: 'create:song', newSong: Song): void;
  (event: 'update:song', i: number, newSong: Song): void;
  (event: 'update:scriptures', newValue: Scripture[]): void;
  (event: 'delete:song', i: number): void;
}>();

let tab = ref('liturgy');

function onCreateSong(newSong: Song) {
  emit('create:song', newSong);
}

function onUpdateSong(newSong: Song) {
  emit('update:song', editingIndex.value, newSong);
}

function onDeleteSong() {
  emit('delete:song', editingIndex.value);
}

function onClickAddSong() {
  showCreateSongDialog.value = true;
}

function onClickSong(i: number) {
  editingIndex.value = i;

  showEditSongDialog.value = true;
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
          <v-btn @click="onClickAddSong" prepend-icon="$plus" variant="tonal"> Song </v-btn>

          <DraggableSongCard
            v-for="(song, i) in songs"
            @click-title="onClickSong(i)"
            :k="i"
            :key="i"
            :song="song"
          />
        </v-window-item>
        <v-window-item value="scripture">
          <v-btn prepend-icon="$plus" variant="tonal"> Scripture </v-btn>
        </v-window-item>
      </v-window>
    </v-card-text>
  </v-card>

  <CreateSongDialog @create:song="onCreateSong" v-model:dialog="showCreateSongDialog" />

  <EditSongDialog
    :songs="songs"
    :i="editingIndex"
    @update:song="onUpdateSong"
    @delete:song="onDeleteSong"
    v-model:dialog="showEditSongDialog"
  />
</template>

<style scoped></style>
