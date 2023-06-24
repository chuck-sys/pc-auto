<script setup lang="ts">
import { ref, reactive, onBeforeUpdate } from 'vue';
import PreviewSongCard from './PreviewSongCard.vue';
import { formattedLyricsToSongParts } from '../store';
import { getSongDetails } from '../vendor-api';
import type { Song } from '../store';

let props = defineProps<{
  songs: Song[],
  i: number,
  dialog: boolean,
}>();

let emit = defineEmits<{
  (event: 'update:song', newSong: Song): void;
  (event: 'delete:song'): void;
  (event: 'update:dialog', state: boolean): void;
  (event: 'cancel'): void;
}>();

let slug = ref('');
let rawLyrics = ref('');
let song: Song = reactive({
  title: '',
  artist: '',
  lyricist: '',
  parts: [],
});

async function onSubmitSlug() {
  const songDetails = await getSongDetails(slug.value);
  song.title = songDetails.title;
  song.artist = songDetails.songcomposer.map((person) => person.label).join(', ');
  song.lyricist = songDetails.songlyricist.map((person) => person.label).join(', ');
  rawLyrics.value = songDetails.lyrics;
}

function onClickUpdateSong() {
  emit('update:song', {
    title: song.title,
    artist: song.artist,
    lyricist: song.lyricist,
    parts: formattedLyricsToSongParts(rawLyrics.value),
  });
  emit('update:dialog', false);
}

function onClickDeleteSong() {
  emit('delete:song');
  emit('update:dialog', false);
}

function onClickRemoveChords() {
  rawLyrics.value = rawLyrics.value.replace(/\[[\w/#]*\]/g, '');
}

function onEditRawLyrics() {
  song.parts = formattedLyricsToSongParts(rawLyrics.value);
}

onBeforeUpdate(() => {
  if (props.i >= props.songs.length) {
    return;
  }

  let untranslatedLyrics = '';
  props.songs[props.i].parts.forEach(part => {
    untranslatedLyrics += `${part.identifier}:\n`;
    part.lyricsBySlide.forEach(slide => {
      untranslatedLyrics += `${slide.join('\n')}\n\n`;
    });
  });
  rawLyrics.value = untranslatedLyrics;

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
          <input type="text" v-model="slug" placeholder="Song Name" @keyup.enter="onSubmitSlug" />

          <PreviewSongCard :song="song" />

          <v-btn @click="onClickRemoveChords"> Remove chords </v-btn>
        </v-col>

        <v-col cols="12" sm="6">
          <textarea v-model="rawLyrics" @change="onEditRawLyrics"></textarea>
        </v-col>
      </v-row>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn @click="onClickUpdateSong" prepend-icon="$pencil">
          Update
        </v-btn>

        <v-btn @click="onClickDeleteSong" prepend-icon="$delete">
          Delete
        </v-btn>

        <v-btn @click="$emit('update:dialog', false)"> Cancel </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped></style>
