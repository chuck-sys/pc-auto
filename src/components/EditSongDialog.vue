<script setup lang="ts">
import { ref, reactive, onBeforeUpdate } from 'vue';
import PreviewSongCard from './PreviewSongCard.vue';
import { formattedLyricsToSongParts } from '../store';
import { getSongDetails } from '../vendor-api';
import type { Song } from '../store';

let props = defineProps<{
  songs: Song[];
  i: number;
  dialog: boolean;
}>();

let emit = defineEmits<{
  (event: 'update:song', newSong: Song): void;
  (event: 'delete:song'): void;
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

function onClickUpdateSong() {
  emit('update:song', {
    title: song.title,
    artist: song.artist,
    lyricist: song.lyricist,
    parts: formattedLyricsToSongParts(rawLyrics.value)
  });
  emit('update:dialog', false);
}

function onClickDeleteSong() {
  emit('delete:song');
  emit('update:dialog', false);
}

function removeChords(text: string): string {
  return text.replace(/\[[\w/#]*\]/g, '');
}

function addColonsAndTrim(text: string): string {
  const lines = text.split('\n');
  let modified: string[] = [];
  let isFirstLineOfParagraph = true;

  for (let i = 0; i < lines.length; i++) {
    const trimmedLine = lines[i].trim();
    if (isFirstLineOfParagraph && trimmedLine.length > 0) {
      modified.push(trimmedLine + ':');
      isFirstLineOfParagraph = false;
    } else if (trimmedLine.length === 0) {
      modified.push(trimmedLine);
      isFirstLineOfParagraph = true;
    } else {
      modified.push(trimmedLine);
    }
  }

  return modified.join('\n');
}

function onClickCleanText() {
  const unchorded = removeChords(rawLyrics.value);
  const cleaned = addColonsAndTrim(unchorded);

  rawLyrics.value = cleaned;

  onEditRawLyrics();
}

function onEditRawLyrics() {
  song.parts = formattedLyricsToSongParts(rawLyrics.value);
}

onBeforeUpdate(() => {
  if (props.i >= props.songs.length) {
    return;
  }

  let untranslatedLyrics = '';
  props.songs[props.i].parts.forEach((part) => {
    untranslatedLyrics += `${part.identifier}:\n`;
    part.lyricsBySlide.forEach((slide) => {
      untranslatedLyrics += `${slide.join('\n')}\n\n`;
    });
  });
  rawLyrics.value = untranslatedLyrics.trimEnd();

  song.title = props.songs[props.i].title;
  song.artist = props.songs[props.i].artist;
  song.lyricist = props.songs[props.i].lyricist;
  onEditRawLyrics();
});
</script>

<template>
  <v-dialog width="auto" @update:modelValue="$emit('update:dialog', $event)" :modelValue="dialog">
    <v-card>
      <v-card-title>Edit Song</v-card-title>
      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field
            type="text"
            v-model="slug"
            placeholder="Song Name"
            @keyup.enter="onSubmitSlug"
          >
            <template v-slot:loader>
              <v-progress-linear :active="searchForSongs" indeterminate color="green">
              </v-progress-linear>
            </template>
          </v-text-field>

          <PreviewSongCard :song="song" />
        </v-col>

        <v-col cols="12" sm="6">
          <v-textarea v-model="rawLyrics" @change="onEditRawLyrics" label="Lyrics"></v-textarea>

          <v-btn @click="onClickCleanText"> Clean text </v-btn>
        </v-col>
      </v-row>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn @click="onClickUpdateSong" prepend-icon="$pencil"> Update </v-btn>

        <v-btn @click="onClickDeleteSong" prepend-icon="$delete"> Delete </v-btn>

        <v-btn @click="$emit('update:dialog', false)"> Cancel </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped></style>
