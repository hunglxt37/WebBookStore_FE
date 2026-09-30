<template>
  <v-container class="py-6">
    <!-- Phần thông tin sản phẩm chính: Ảnh bên trái & Thông tin + Mua hàng bên phải -->
    <v-row v-if="bookStore.book">
      <!-- Ảnh sách -->
      <v-col cols="12" md="5">
        <book-image :images="bookStore.book.images" />
      </v-col>

      <!-- Thông tin chi tiết, giá tiền, mô tả & nút mua -->
      <v-col cols="12" md="7">
        <book-info
          :book="bookStore.book"
          @them-gio-hang="handleAddToCart"
          @mua-ngay="handleBuyNow"
        />
      </v-col>
    </v-row>

    <!-- Đánh giá & Nhận xét của khách hàng -->
    <v-row v-if="bookStore.book">
      <v-col cols="12">
        <book-reviews :book-id="bookStore.book.id" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import BookImage from '@/components/books/detail/BookImage.vue';
import BookInfo from '@/components/books/detail/BookInfo.vue';
import BookReviews from '@/components/books/detail/BookReviews.vue';
import { useBookStore } from '@/stores/book.store';
import { useCartStore } from '@/stores/cart.store';
import { useAuthStore } from '@/stores/auth';
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const bookStore = useBookStore();
const cartStore = useCartStore();
const authStore = useAuthStore();

onMounted(async () => {
  const id = route.params.id;
  await bookStore.fetchBookById(id);
});

const handleAddToCart = async ({ bookId, quantity }) => {
  if (!authStore.isLoggedIn) {
    toast.info('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.');
    router.push('/auth/login');
    return;
  }
  await cartStore.addToCart(bookId, quantity);
};

const handleBuyNow = async ({ bookId, quantity }) => {
  if (!authStore.isLoggedIn) {
    toast.info('Vui lòng đăng nhập để tiếp tục mua hàng.');
    router.push('/auth/login');
    return;
  }
  await cartStore.addToCart(bookId, quantity);
  router.push('/carts');
};
</script>

<style scoped></style>
