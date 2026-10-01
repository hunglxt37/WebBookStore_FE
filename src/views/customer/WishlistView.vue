<template>
  <v-container class="py-6" style="max-width: 1100px;">
    <!-- Header -->
    <div class="d-flex align-center justify-space-between flex-wrap ga-3 mb-5">
      <div>
        <h2 class="text-h5 font-weight-bold text-primary d-flex align-center ga-2">
          <v-icon icon="mdi-heart" color="red" />
          <span>SÁCH YÊU THÍCH</span>
          <span class="text-body-1 font-weight-regular text-grey-darken-1">
            ({{ favoriteStore.totalFavorites }} cuốn)
          </span>
        </h2>
        <p class="text-caption text-grey-darken-1 mb-0">
          Danh sách các đầu sách bạn đã lưu để xem lại hoặc mua sau.
        </p>
      </div>

      <v-btn
        variant="tonal"
        color="primary"
        prepend-icon="mdi-book-open-page-variant"
        to="/books"
        class="text-none font-weight-bold rounded-lg"
      >
        Tiếp tục khám phá sách
      </v-btn>
    </div>

    <!-- Loading Skeleton -->
    <div v-if="favoriteStore.loading">
      <v-card v-for="n in 3" :key="n" class="pa-4 mb-3 rounded-xl border" elevation="0">
        <v-skeleton-loader type="list-item-avatar-three-line" />
      </v-card>
    </div>

    <!-- Danh sách rỗng -->
    <v-card
      v-else-if="favoriteStore.isEmpty"
      class="pa-12 text-center rounded-xl bg-surface"
      elevation="1"
    >
      <v-avatar color="red-lighten-5" size="100" class="mb-4">
        <v-icon icon="mdi-heart-broken-outline" size="50" color="red" />
      </v-avatar>
      <h3 class="text-h6 font-weight-bold text-grey-darken-3">
        Danh sách yêu thích đang trống
      </h3>
      <p class="text-body-2 text-grey mt-1 mb-6" style="max-width: 400px; margin: 0 auto;">
        Hãy thả tim ❤️ những cuốn sách bạn ưng ý khi lướt xem để lưu lại danh sách riêng của mình nhé!
      </p>
      <v-btn
        color="primary"
        size="large"
        prepend-icon="mdi-magnify"
        to="/books"
        class="font-weight-bold text-none rounded-lg px-6"
      >
        Tìm sách ngay
      </v-btn>
    </v-card>

    <!-- Danh Sách Sách Yêu Thích (Horizontal List Layout) -->
    <div v-else class="favorite-list">
      <v-card
        v-for="item in favoriteStore.favorites"
        :key="item.id || item.bookId"
        class="pa-4 mb-3 rounded-xl favorite-item-card"
        elevation="1"
      >
        <v-row class="align-center" no-gutters>
          <!-- Cột 1: Ảnh bìa sách -->
          <v-col cols="12" sm="3" md="2" class="d-flex justify-center justify-sm-start pe-sm-4 pb-3 pb-sm-0">
            <div class="position-relative book-thumb-wrapper">
              <router-link :to="`/books/${item.bookId}`">
                <v-img
                  :src="item.thumbnailUrl"
                  width="105"
                  height="145"
                  cover
                  class="rounded-lg bg-grey-lighten-4 elevation-1"
                >
                  <template #error>
                    <v-img
                      src="https://www.freeiconspng.com/thumbs/no-image-icon/no-image-icon-6.png"
                      width="105"
                      height="145"
                      cover
                    />
                  </template>
                </v-img>
              </router-link>

              <!-- Chip giảm giá góc ảnh bìa -->
              <v-chip
                v-if="item.discountPercent && item.discountPercent > 0"
                color="red"
                size="x-small"
                class="position-absolute font-weight-bold"
                style="top: 4px; left: 4px; z-index: 2;"
              >
                -{{ item.discountPercent }}%
              </v-chip>
            </div>
          </v-col>

          <!-- Cột 2: Thông tin sách (Tên, Tác giả, Tình trạng kho) -->
          <v-col cols="12" sm="5" md="4" class="pe-sm-3 pb-3 pb-sm-0">
            <router-link
              :to="`/books/${item.bookId}`"
              class="text-decoration-none"
            >
              <h3
                class="text-subtitle-1 font-weight-bold text-grey-darken-4 line-clamp-2 mb-1 book-title-link"
                :title="item.name"
              >
                {{ item.name }}
              </h3>
            </router-link>

            <div class="text-body-2 text-grey-darken-1 mb-2">
              Tác giả: <span class="font-weight-medium text-grey-darken-3">{{ item.author || 'Chưa rõ' }}</span>
            </div>

            <div>
              <v-chip
                size="x-small"
                :color="item.status === 'ACTIVE' ? 'success' : 'grey'"
                variant="tonal"
                class="font-weight-medium"
              >
                {{ item.status === 'ACTIVE' ? 'Đang mở bán' : 'Tạm ngưng' }}
              </v-chip>
            </div>
          </v-col>

          <!-- Cột 3: Giá bán & Ngày lưu (Nằm cùng cột) -->
          <v-col cols="12" sm="4" md="3" class="text-sm-center text-md-left pe-md-3 pb-3 pb-sm-0">
            <!-- Giá bán và giá gốc gạch ngang nằm cùng 1 hàng -->
            <div class="d-flex align-baseline flex-wrap ga-2 mb-2">
              <span class="text-h6 font-weight-bold text-red-darken-2 lh-1">
                {{ formatPrice(item.sellPrice) }} đ
              </span>
              <span
                v-if="item.listPrice && item.listPrice > item.sellPrice"
                class="text-caption text-grey text-decoration-line-through"
              >
                {{ formatPrice(item.listPrice) }} đ
              </span>
            </div>

            <!-- Ngày đã lưu nằm ngay bên dưới giá -->
            <div v-if="item.addedAt" class="text-caption text-grey-darken-1 d-flex align-center ga-1">
              <v-icon icon="mdi-calendar-clock-outline" size="14" color="grey" />
              <span>Đã lưu: {{ formatDate(item.addedAt) }}</span>
            </div>
          </v-col>

          <!-- Cột 4: Nút hành động (Xếp chồng 3 nút gọn gàng) -->
          <v-col cols="12" sm="12" md="3" class="d-flex flex-column justify-center ga-2">
            <v-btn
              color="primary"
              variant="flat"
              size="small"
              prepend-icon="mdi-cart-plus"
              class="font-weight-bold text-none rounded-lg"
              :disabled="item.status === 'INACTIVE'"
              @click="handleAddToCart(item.bookId)"
            >
              Thêm giỏ
            </v-btn>

            <v-btn
              variant="outlined"
              color="primary"
              size="small"
              prepend-icon="mdi-eye"
              class="font-weight-medium text-none rounded-lg"
              :to="`/books/${item.bookId}`"
            >
              Chi tiết
            </v-btn>

            <!-- Nút Bỏ thích viền đỏ đậm rõ nét -->
            <v-btn
              variant="outlined"
              color="red-darken-3"
              size="small"
              prepend-icon="mdi-delete-outline"
              class="font-weight-bold text-none rounded-lg btn-remove"
              @click="handleRemove(item.bookId)"
            >
              Bỏ thích
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
    </div>
  </v-container>
</template>

<script setup>
import { onMounted } from 'vue';
import { useFavoriteStore } from '@/stores/favorite.store';
import { useCartStore } from '@/stores/cart.store';
import { useToast } from 'vue-toastification';

const favoriteStore = useFavoriteStore();
const cartStore = useCartStore();
const toast = useToast();

onMounted(async () => {
  await favoriteStore.fetchFavorites();
});

const handleRemove = async (bookId) => {
  await favoriteStore.toggleFavorite(bookId);
};

const handleAddToCart = async (bookId) => {
  try {
    await cartStore.addToCart(bookId, 1);
    toast.success('Đã thêm sản phẩm vào giỏ hàng!');
  } catch (err) {
    console.error('Lỗi khi thêm vào giỏ hàng:', err);
  }
};

const formatPrice = (price) => new Intl.NumberFormat('vi-VN').format(price || 0);

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};
</script>

<style scoped>
.favorite-item-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border: 1px solid #e2e8f0 !important;
}
.favorite-item-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06) !important;
  border-color: #cbd5e1 !important;
}
.book-thumb-wrapper {
  flex-shrink: 0;
}
.book-title-link {
  transition: color 0.2s ease;
}
.book-title-link:hover {
  color: #1a365d !important;
}
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.btn-remove {
  border-color: #ef4444 !important;
  color: #dc2626 !important;
  background-color: #fef2f2 !important;
  transition: all 0.2s ease;
}
.btn-remove:hover {
  background-color: #fee2e2 !important;
  border-color: #dc2626 !important;
  color: #b91c1c !important;
}
</style>
