<script setup lang="ts">
import { ref } from 'vue';
import { getSongDetails } from './vendor-api';
import { formattedLyricsToSongParts } from './store';
import type { Song } from './store';
import type { Ref } from 'vue';

let songSlug = ref('');
let songText = ref('');
let songStructure: Ref<Song> = ref({
  title: '',
  artist: '',
  lyricist: '',
  parts: [],
});

async function onSubmitSongSlug() {
  const song = await getSongDetails(songSlug.value);
  songStructure.value.title = songSlug.value;
  songStructure.value.artist = song.person;
  songStructure.value.lyricist = song.person;
  songText.value = song.lyrics;
}

async function onEditSongText() {
  songStructure.value.parts = formattedLyricsToSongParts(songText.value);
}
</script>

<template>
  <input type="text" :model="songSlug" placeholder="Song Slug" @keyup.enter="onSubmitSongSlug" />

  <textarea cols="30" rows="10" :model="songText" @change="onEditSongText"></textarea>

  <section>
    <p>{{ songStructure.title }}</p>
    <p>{{ songStructure.artist }} - {{ songStructure.lyricist }}</p>

    <section v-for="part in songStructure.parts">
      <p>{{ part.identifier }}</p>

      <section v-for="(slideLyrics, i) in part.lyricsBySlide">
        <p>Slide {{ i }}</p>

        <p v-for="line in slideLyrics">{{ line }}</p>
      </section>
    </section>
  </section>
</template>

<style scoped>
</style>
