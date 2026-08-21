import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import { createHead } from "@unhead/vue/client";

import App from "./App.vue";
import router from "./router";

import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css";

import vuetify from "./plugins/vuetify";

import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

const app = createApp(App);
const head = createHead();

app.use(createPinia());
app.use(router);
app.use(vuetify);
app.use(head);

app.use(Toast, {
  position: "top-right",
  timeout: 2000,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
});

app.mount("#app");
