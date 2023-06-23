<script setup lang="ts">
import { ref, computed } from 'vue';
import SongCard from './SongCard.vue';
import { formattedLyricsToSongParts } from '../store';
import { getSongDetails } from '../vendor-api';
import type { Song } from '../store';

defineProps<{
  song?: Song;
  dialog: boolean;
  isEditingExistingSong: boolean;
}>();

let emit = defineEmits<{
  (event: 'update:song', newSong: Song): void;
  (event: 'create:song', newSong: Song): void;
  (event: 'delete:song'): void;
  (event: 'update:dialog', state: boolean): void;
  (event: 'cancel'): void;
}>();

let slug = ref('');
let rawLyrics = ref('');
let songTitle = ref('');
let songArtist = ref('');
let songLyricist = ref('');
const parts = computed(() => formattedLyricsToSongParts(rawLyrics.value));
const tmpSong = computed(() => {
  return {
    title: songTitle.value,
    artist: songArtist.value,
    lyricist: songLyricist.value,
    parts: parts.value
  };
});

async function onSubmitSlug() {
  const songDetails = await getSongDetails(slug.value);
  songTitle.value = songDetails.title;
  songArtist.value = songDetails.songcomposer.map((person) => person.label).join(', ');
  songLyricist.value = songDetails.songlyricist.map((person) => person.label).join(', ');
  rawLyrics.value = songDetails.lyrics;
}

function onClickCreateSong() {
  emit('create:song', tmpSong.value);
  emit('update:dialog', false);
}

function onClickUpdateSong() {}

function onClickRemoveChords() {
  rawLyrics.value = rawLyrics.value.replace(/\[[\w/#]*\]/g, '');
}
</script>

<template>
  <v-dialog width="auto" @update:modelValue="$emit('update:dialog', $event)" :modelValue="dialog">
    <v-card>
      <v-card-title v-if="isEditingExistingSong">Edit Song</v-card-title>
      <v-card-title v-else>New Song</v-card-title>
      <v-row>
        <v-col cols="12" sm="6">
          <input type="text" v-model="slug" placeholder="Song Name" @keyup.enter="onSubmitSlug" />

          <SongCard :song="tmpSong" />

          <v-btn @click="onClickRemoveChords"> Remove chords </v-btn>
        </v-col>

        <v-col cols="12" sm="6">
          <textarea v-model="rawLyrics"></textarea>
        </v-col>
      </v-row>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn @click="onClickCreateSong" v-show="!isEditingExistingSong" prepend-icon="$plus">
          Create
        </v-btn>

        <v-btn @click="onClickUpdateSong" v-show="isEditingExistingSong" prepend-icon="$pencil">
          Update
        </v-btn>

        <v-btn @click="$emit('delete:song')" v-show="isEditingExistingSong" prepend-icon="$delete">
          Delete
        </v-btn>

        <v-btn @click="$emit('update:dialog', false)"> Cancel </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped></style>
