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

            <!-- <v-btn icon variant="text">
                <v-icon>
                    mdi-cart-outline
                </v-icon>
            </v-btn> -->

            <!-- Wishlist -->
            <v-btn icon variant="text" class="me-1" @click="handleWishlistClick">
                <v-badge v-if="authStore.isLoggedIn && favoriteStore.totalFavorites > 0" location="top right" color="red"
                    :content="favoriteStore.totalFavorites">
                    <v-icon icon="mdi-heart-outline" />
                </v-badge>
                <v-icon v-else icon="mdi-heart-outline" />
            </v-btn>

            <!-- Cart -->
            <v-btn icon variant="text" @click="handleCartClick">
                <v-badge v-if="authStore.isLoggedIn" location="top right" color="primary"
                    :content="useCart.totalQuantity">
                    <v-icon icon="mdi-cart-outline" />
                </v-badge>

                <v-icon v-else icon="mdi-cart-outline" />
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

                    
                    <v-list-item title="Xem hồ sơ" prepend-icon="mdi-account-outline" @click="router.push('/profile')" />
                    <v-list-item title="Sách Yêu Thích" prepend-icon="mdi-heart-outline" @click="router.push('/wishlist')" />
                    <v-list-item title="Lịch Sử Đơn Hàng" prepend-icon="mdi-clipboard-text-outline" @click="router.push('/order-history')" />
                    <v-divider class="my-1" />
                    <v-list-item title="Đăng xuất" prepend-icon="mdi-logout" color="red" @click="authStore.logout()" />
                </v-list>

            </v-menu>

        </v-container>
    </v-app-bar>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { useRouter } from "vue-router";
import { onMounted, watchEffect } from "vue";
import { useCartStore } from '@/stores/cart.store';
import { useFavoriteStore } from '@/stores/favorite.store';

const router = useRouter()
const authStore = useAuthStore()
const useCart = useCartStore()
const favoriteStore = useFavoriteStore()

watchEffect(() => {
    if (authStore.isLoggedIn) {
        favoriteStore.fetchFavorites()
    }
});

const handleWishlistClick = () => {
    if (!authStore.isLoggedIn) {
        router.push({ path: '/auth/login', query: { redirect: '/wishlist' } })
        return
    }
    router.push('/wishlist')
}

const handleCartClick = () => {
    if (!authStore.isLoggedIn) {
        // toast (bạn chưa đăng nhập nên chưa có sản phẩm nào)
        router.push('/auth/login')
        return
    }

    router.push('/carts')
}

</script>

<style scoped>
.logo {
    font-size: 25px;
    font-weight: bold;
    color: #143d8f;
    white-space: nowrap;
}
</style>