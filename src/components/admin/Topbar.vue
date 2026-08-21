<template>
    <header class="topbar">
        <div class="d-flex justify-space-between align-center">

            <!-- Search -->
            <div style="width: 350px;">
                <div class="search-input-group d-flex align-center">
                    <span class="search-icon-wrapper">
                        <v-icon icon="mdi-magnify" size="small"></v-icon>
                    </span>
                    <input type="text" class="search-input" placeholder="Search book catalog...">
                </div>
            </div>

            <!-- Right -->
            <div class="d-flex align-center ga-4">
                <v-icon icon="mdi-bell" class="action-icon"></v-icon>
                <v-icon icon="mdi-cog" class="action-icon"></v-icon>

                <div class="d-flex align-center">
                    <div class="text-end me-2">
                        <div class="font-weight-bold">
                            {{ authStore.fullName }}
                        </div>
                        <small class="text-grey">
                            {{ authStore.email }}
                        </small>
                    </div>

                    <img :src="authStore.userInfo?.avatar || 'https://cdn2.fptshop.com.vn/small/avatar_trang_1_cd729c335b.jpg'"
                        class="rounded-circle" width="45" height="45">
                </div>
            </div>

        </div>
    </header>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore()



</script>

<style scoped>
.topbar {
    background: white;
    padding: 15px 30px;
    border-bottom: 1px solid #eee;
}

.action-icon {
    font-size: 20px;
    cursor: pointer;
    transition: color 0.2s;
}

.action-icon:hover {
    color: #0d6efd;
}

.search-input-group {
    border: 1px solid #ced4da;
    border-radius: 8px;
    overflow: hidden;
    background-color: white;
    width: 100%;
}

.search-icon-wrapper {
    padding: 8px 12px;
    color: #6c757d;
    display: flex;
    align-items: center;
}

.search-input {
    border: none;
    outline: none;
    padding: 8px 12px 8px 0;
    width: 100%;
    font-size: 0.95rem;
}
</style>