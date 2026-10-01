<template>
  <v-card class="book-card rounded-lg h-100 d-flex flex-column" elevation="1" hover>
    <!-- Khung ảnh bìa sách -->
    <div class="book-image-container pa-3 d-flex justify-center align-center position-relative">
      <router-link :to="`/books/${book.id}`" class="d-flex justify-center w-100">
        <v-img
          :src="book.thumbnailUrl"
          height="210"
          max-width="100%"
          contain
          class="book-image rounded"
        >
          <template #error>
            <v-img
              src="https://www.freeiconspng.com/thumbs/no-image-icon/no-image-icon-6.png"
              height="210"
              contain
            />
          </template>
        </v-img>
      </router-link>

      <!-- Nút Trái tim Yêu thích góc trên bên phải ảnh bìa -->
      <v-btn
        icon
        size="x-small"
        variant="flat"
        color="white"
        class="position-absolute heart-btn"
        style="top: 8px; right: 8px; z-index: 2;"
        title="Lưu yêu thích"
        @click.stop.prevent="favoriteStore.toggleFavorite(book)"
      >
        <v-icon
          :icon="favoriteStore.isFavorite(book.id) ? 'mdi-heart' : 'mdi-heart-outline'"
          :color="favoriteStore.isFavorite(book.id) ? 'red' : 'grey-darken-1'"
          size="18"
        />
      </v-btn>
    </div>

    <!-- Nội dung thẻ sách -->
    <v-card-text class="px-3 pb-3 pt-1 flex-grow-1 d-flex flex-column justify-space-between">
      <div>
        <!-- Tiêu đề sách: In đậm, to rõ ràng -->
        <router-link :to="`/books/${book.id}`" class="text-decoration-none">
          <h3 class="book-title line-clamp-2 mb-1" :title="book.name">
            {{ book.name }}
          </h3>
        </router-link>

        <!-- Đánh giá sao ngay bên dưới tên sách (theo mũi tên đỏ chỉ lên) -->
        <div class="d-flex align-center ga-1 mb-2">
          <v-rating
            :model-value="book.avgRating || 0"
            readonly
            density="compact"
            size="14"
            color="amber-darken-2"
            half-increments
          />
          <span class="text-caption text-grey">
            ({{ book.avgRating ? Number(book.avgRating).toFixed(1) : '0' }})
          </span>
        </div>
      </div>

      <!-- Giá bán, Giá gốc & % Giảm giá nằm CÙNG 1 HÀNG NGANG (không rớt dòng) -->
      <div class="price-container mt-auto pt-1">
        <div class="price-row d-flex align-center">
          <!-- Giá bán hiện tại -->
          <span class="sell-price font-weight-bold">
            {{ formatPrice(book.sellPrice) }} đ
          </span>

          <!-- Giá gốc gạch ngang nằm ngay cạnh -->
          <span
            v-if="book.listPrice && book.listPrice > book.sellPrice"
            class="original-price text-grey text-decoration-line-through text-truncate ms-2"
          >
            {{ formatPrice(book.listPrice) }} đ
          </span>

          <!-- Badge % giảm giá nằm ngay sau giá gốc -->
          <span
            v-if="book.discountPercent && book.discountPercent > 0"
            class="discount-badge ms-1"
          >
            -{{ book.discountPercent }}%
          </span>
        </div>
      </div>
    </v-card-text>

    <!-- Đường kẻ phân cách -->
    <v-divider />

    <!-- Nút XEM CHI TIẾT (vòng tròn mũi tên xanh + XEM CHI TIẾT) -->
    <v-card-actions class="pa-0">
      <v-btn
        block
        variant="text"
        :to="`/books/${book.id}`"
        class="action-btn text-none py-2.5 h-auto"
      >
        <div class="action-circle me-2">
          <v-icon icon="mdi-chevron-right" size="16" color="white" />
        </div>
        <span class="action-label font-weight-bold text-uppercase">XEM CHI TIẾT</span>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { useFavoriteStore } from "@/stores/favorite.store";

const favoriteStore = useFavoriteStore();

defineProps({
  book: {
    type: Object,
    required: true,
  },
});

const formatPrice = (price) => new Intl.NumberFormat("vi-VN").format(price || 0);
</script>

<style scoped>
.book-card {
  border: 1px solid #e2e8f0;
  border-radius: 8px !important;
  background-color: #ffffff;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.book-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08) !important;
}
.book-image-container {
  background-color: #ffffff;
  min-height: 220px;
}
.book-image {
  transition: transform 0.3s ease;
}
.book-card:hover .book-image {
  transform: scale(1.03);
}
.book-title {
  font-size: 17px;
  font-weight: 700;
  line-height: 1.35;
  min-height: 48px;
  color: #0f172a;
  transition: color 0.2s ease;
}
.book-title:hover {
  color: #2563eb;
}
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Hàng hiển thị giá: Cam kết nằm trên cùng 1 hàng ngang */
.price-row {
  white-space: nowrap;
  overflow: hidden;
  line-height: 1.2;
}
.sell-price {
  font-size: 16px;
  font-weight: 800;
  color: #2563eb;
  flex-shrink: 0;
}
.original-price {
  font-size: 12px;
  color: #94a3b8;
  flex-shrink: 1;
}
.discount-badge {
  font-size: 10px;
  font-weight: 700;
  color: #ef4444;
  background-color: #fee2e2;
  padding: 1px 4px;
  border-radius: 4px;
  flex-shrink: 0;
  display: inline-block;
  vertical-align: middle;
}

.heart-btn {
  opacity: 0.9;
  transition: transform 0.2s ease, opacity 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12) !important;
}
.heart-btn:hover {
  transform: scale(1.15);
  opacity: 1;
}
.action-btn {
  letter-spacing: 0.5px;
}
.action-circle {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #2563eb;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease, background-color 0.2s ease;
}
.action-label {
  color: #2563eb;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.8px;
}
.action-btn:hover .action-circle {
  transform: translateX(3px);
  background-color: #1d4ed8;
}
.action-btn:hover .action-label {
  color: #1d4ed8;
}
</style>