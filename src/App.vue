<script setup>
import AppLoader from './components/common/AppLoader.vue';
import { useLoadingStore } from './stores/loading.js';

const loadingStore = useLoadingStore()
</script>

<template>
  <v-app>
    <AppLoader v-if="loadingStore.loading" />
    <RouterView />

  </v-app>
</template>

<style scoped></style>
