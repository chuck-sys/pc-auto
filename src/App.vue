<script setup lang="ts">
import { ref } from 'vue';
import { getSongDetails } from './vendor-api';
import { formattedLyricsToSongParts } from './store';
import pptxgen from 'pptxgenjs';
import type { Song } from './store';
import type { Ref } from 'vue';

let songSlug = ref('');
let songText = ref('');
let songStructure: Ref<Song> = ref({
  title: '',
  artist: '',
  lyricist: '',
  parts: []
});
let partsSequence: Ref<number[]> = ref([]);

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

async function onClickDownloadPrez() {
  let pres = new pptxgen();

  partsSequence.value.forEach((i) => {
    const part = songStructure.value.parts[i];
    part.lyricsBySlide.forEach((text) => {
      let slide = pres.addSlide();
      slide.addText(text.join('\n'), { x: 0, y: 1, w: 10, fontSize: 48 });
    });
  });

  pres.writeFile({ fileName: 'demo.pptx' });
}
</script>

<template>
  <input type="text" v-model="songSlug" placeholder="Song Slug" @keyup.enter="onSubmitSongSlug" />

  <textarea cols="30" rows="10" v-model="songText" @change="onEditSongText"></textarea>

  <section>
    <p>{{ songStructure.title }}</p>
    <p>{{ songStructure.artist }} - {{ songStructure.lyricist }}</p>

    <section v-for="(part, partI) in songStructure.parts" :key="partI">
      <p @click="partsSequence.push(partI)">{{ part.identifier }}</p>

      <section v-for="(slideLyrics, i) in part.lyricsBySlide" :key="i">
        <p>Slide {{ i }}</p>

        <p v-for="line in slideLyrics" :key="line">{{ line }}</p>
      </section>
    </section>
  </section>

  <p>{{ partsSequence.map((i) => songStructure.parts[i].identifier).join(' > ') }}</p>

  <button @click="onClickDownloadPrez">Download presentation</button>
</template>

<style scoped></style>
