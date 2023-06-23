import './assets/main.css';

import { createApp } from 'vue';
import App from './App.vue';

// Vuetify
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg';
import { mdiPlus, mdiDelete, mdiPencil } from '@mdi/js';

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'dark'
  },
  icons: {
    defaultSet: 'mdi',
    aliases: {
      ...aliases,
      plus: mdiPlus,
      delete: mdiDelete,
      pencil: mdiPencil
    },
    sets: {
      mdi
    }
  }
});

createApp(App).use(vuetify).mount('#app');
