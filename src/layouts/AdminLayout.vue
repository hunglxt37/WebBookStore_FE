<script setup >
import Sidebar from '@/components/admin/Sidebar.vue';
import Topbar from '@/components/admin/Topbar.vue';
import { RouterView } from 'vue-router';

</script>

<template>

    <div class="d-flex">
        <sidebar />
        <div class="flex-grow-1">
          <topbar />
            <main class="pa-4">

                <router-view />

            </main>
        </div>
    </div>

</template>