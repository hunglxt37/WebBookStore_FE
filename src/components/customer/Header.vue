<template>
    <v-app-bar elevation="1" color="#F8F9FA" height="80">
        <v-container class="d-flex align-center">

            <!-- Logo -->
            <h1 class="logo" @click="router.push({ name: 'home' })">
                Lumina Books
            </h1>

            <!-- Menu -->
            <div class="d-flex ml-4 ga-2">

                <router-link to="/books">
                    <v-btn variant="text" class="font-weight-bold">
                        Sản Phẩm
                    </v-btn>
                </router-link>


                <v-btn variant="text">
                    Sách mới
                </v-btn>

                <v-btn variant="text">
                    Bán chạy
                </v-btn>

                <v-btn variant="text">
                    Khuyến mãi HOT
                </v-btn>

            </div>

            <v-spacer />

            <!-- Search -->

            <v-text-field class="me-1" prepend-inner-icon="mdi-magnify" placeholder="Tìm kiếm sách..." hide-details
                density="comfortable" variant="outlined" rounded="xl" width="220" />

            <!-- Cart -->

            <v-btn icon variant="text">
                <v-icon>
                    mdi-cart-outline
                </v-icon>
            </v-btn>

            <!-- Login Register -->

            <v-menu>

                <template #activator="{ props }">
                    <div class="d-flex align-center cursor-pointer text-primary" v-bind="props">
                        <v-btn icon variant="text">
                            <v-icon>mdi-account-circle-outline</v-icon>
                        </v-btn>
                        <span v-if="authStore.isLoggedIn" class="me-2 font-weight-medium" style="white-space: nowrap">
                            {{ authStore.fullName }}
                        </span>
                    </div>
                </template>

                <v-list v-if="!authStore.isLoggedIn">

                    <v-list-item title="Đăng nhập" @click="router.push('/auth/login')" />

                    <v-list-item title="Đăng ký" @click="router.push('/auth/register')" />

                </v-list>

                <v-list v-else>

                    <!-- <v-list-item>
                        {{ authStore.fullName }}
                    </v-list-item> -->

                    <v-list-item title="Xem hồ sơ" @click="router.push('/profile')" />
                    <v-list-item title="Đăng xuất" @click="authStore.logout()" />
                </v-list>

            </v-menu>

        </v-container>
    </v-app-bar>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { useRouter } from "vue-router";
import { watchEffect } from "vue";
const router = useRouter()
const authStore = useAuthStore()

watchEffect(() => {
    console.log("Header:", authStore.userInfo);
});

</script>

<style scoped>
.logo {
    font-size: 25px;
    font-weight: bold;
    color: #143d8f;
    white-space: nowrap;
}
</style>