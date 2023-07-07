<script setup lang="ts">
defineEmits<{
  (event: 'click-download'): void;
}>();
</script>

<template>
  <v-card>
    <v-card-title>Global Options</v-card-title>
    <v-card-text>
      <v-text-field label="Date" type="date" />
    </v-card-text>
    <v-card-actions>
      <v-btn @click="$emit('click-download')">Download</v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped></style>
