<script setup lang="ts">
import { ref, reactive } from 'vue';
import PreviewSongCard from './PreviewSongCard.vue';
import { formattedLyricsToSongParts } from '../store';
import { getSongDetails } from '../vendor-api';
import type { Song } from '../store';

defineProps<{
  dialog: boolean;
}>();

let emit = defineEmits<{
  (event: 'create:song', newSong: Song): void;
  (event: 'update:dialog', state: boolean): void;
  (event: 'cancel'): void;
}>();

let searchForSongs = ref(false);
let slug = ref('');
let rawLyrics = ref('');
let song: Song = reactive({
  title: '',
  artist: '',
  lyricist: '',
  parts: []
});

async function onSubmitSlug() {
  searchForSongs.value = true;

  const songDetails = await getSongDetails(slug.value);
  song.title = songDetails.title;
  song.artist = songDetails.songcomposer.map((person) => person.label).join(', ');
  song.lyricist = songDetails.songlyricist.map((person) => person.label).join(', ');
  rawLyrics.value = songDetails.lyrics;

  searchForSongs.value = false;
}

function onClickCreateSong() {
  emit('create:song', {
    title: song.title,
    artist: song.artist,
    lyricist: song.lyricist,
    parts: song.parts.map((x) => {
      return {
        identifier: x.identifier,
        lyricsBySlide: x.lyricsBySlide.map((slide) => slide.map((line) => line))
      };
    })
  });
  emit('update:dialog', false);

  song.title = '';
  song.artist = '';
  song.lyricist = '';
  song.parts = [];
  slug.value = '';
  rawLyrics.value = '';
}

function onClickRemoveChords() {
  rawLyrics.value = rawLyrics.value.replace(/\[[\w/#]*\]/g, '');
}

function onEditRawLyrics() {
  song.parts = formattedLyricsToSongParts(rawLyrics.value);
}
</script>

<template>
  <v-dialog width="80rem" @update:modelValue="$emit('update:dialog', $event)" :modelValue="dialog">
    <v-card>
      <v-card-title>New Song</v-card-title>
      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field
            label="Search for songs..."
            single-line
            prepend-inner-icon="$magnify"
            v-model="slug"
            @keyup.enter="onSubmitSlug"
            placeholder="迷羊"
          >
            <template v-slot:loader>
              <v-progress-linear :active="searchForSongs" indeterminate color="green">
              </v-progress-linear>
            </template>
          </v-text-field>

          <PreviewSongCard :song="song" />
        </v-col>

        <v-col cols="12" sm="6">
          <v-textarea
            v-model="rawLyrics"
            height="30rem"
            label="Lyrics"
            @change="onEditRawLyrics"
          ></v-textarea>

          <v-btn @click="onClickRemoveChords"> Remove chords </v-btn>
        </v-col>
      </v-row>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn @click="onClickCreateSong" prepend-icon="$plus"> Create </v-btn>

        <v-btn @click="$emit('update:dialog', false)"> Cancel </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped></style>
