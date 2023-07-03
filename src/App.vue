<script setup lang="ts">
import { ref, reactive, provide } from 'vue';
import TabbedDragDrop from './components/TabbedDragDrop.vue';
import DraggableTimeline from './components/DraggableTimeline.vue';
import GlobalOptions from './components/GlobalOptions.vue';
import type { Ref } from 'vue';
import type { Song, PresentationConfig } from './store';
import type { Template } from './templates';

let saveData: PresentationConfig = reactive({
  presentationDate: new Date(),
  fontSize: 48,
  parts: [],
  scriptures: [],
  songs: []
});

let selectedTemplate: Ref<{} | Template> = ref({});
let optionsModel: Ref<'global' | 'template'> = ref('global');

provide('songs', saveData.songs);
provide('scriptures', saveData.scriptures);

function onCreateSong(song: Song) {
  saveData.songs.push(song);
}

function onUpdateSong(i: number, newSong: Song) {
  saveData.songs[i] = newSong;
}

function onDeleteSong(i: number) {
  // When deleting a song, it is important to remember that there could be other songs with a higher
  // index, and we will have to re-index all the parts after a certain index. This is as simple as going
  // through all parts and decreasing the index by 1 if the index is greater than i
  saveData.songs.splice(i, 1);

  // Iterate backwards so we can delete parts safely
  for (let i = saveData.parts.length - 1; i >= 0; i--) {
    const part = saveData.parts[i];
    if (part.type === 'song') {
      if (part.songId === i) {
        saveData.parts.splice(i, 1);
      } else if (part.songId > i) {
        part.songId--;
      }
    }
  }

  // Another solution to this would be to simply not allow any song deletions at all, and instead have the
  // user delete all save data (parts, songs, scriptures, etc.).
}

function onPreviewTemplate(template: Template) {
  return template;
}

function onClickDownload() {}

function onClickTemplateOptions(t: Template) {
  selectedTemplate.value = t;
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
        />
      </v-col>

      <v-col cols="12" sm="2">
        <DraggableTimeline
          @preview-template="onPreviewTemplate"
          @click-template-options="onClickTemplateOptions"
          v-model:parts="saveData.parts"
        />
      </v-col>

      <v-col cols="12" sm="5">
        <GlobalOptions v-if="optionsModel === 'global'" @click-download="onClickDownload" />
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped></style>
