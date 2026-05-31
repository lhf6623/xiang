import '@unocss/reset/tailwind.css';
import 'uno.css';

import { createApp } from 'vue';
import App from './App.vue';
import { store } from '@/stores/app';



const app = createApp(App);
app.use(store);

app.mount('#app');
