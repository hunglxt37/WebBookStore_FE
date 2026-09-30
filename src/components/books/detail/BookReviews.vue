<template>
  <v-card class="pa-6 rounded-lg mt-6" elevation="1">
    <div class="d-flex align-center justify-space-between mb-4 flex-wrap ga-2">
      <h2 class="text-h6 font-weight-bold ma-0">
        Khách hàng đánh giá & nhận xét
      </h2>
      <v-chip color="primary" variant="tonal" size="small" class="font-weight-medium">
        {{ summary.totalReviews }} lượt đánh giá
      </v-chip>
    </div>

    <v-card variant="flat" color="blue-grey-lighten-5" class="pa-5 rounded-lg mb-6">
      <v-row align="center">
        <v-col cols="12" md="4" class="text-center border-md-e">
          <div class="text-h3 font-weight-bold text-amber-darken-3 mb-1">
            {{ summary.avgRating ? summary.avgRating.toFixed(1) : '0.0' }}
          </div>
          <v-rating
            :model-value="summary.avgRating || 0"
            readonly
            half-increments
            active-color="amber-darken-3"
            color="grey-lighten-1"
            density="comfortable"
            class="mb-1"
          />
          <div class="text-caption text-grey-darken-1 font-weight-medium">
            (Dựa trên {{ summary.totalReviews }} đánh giá thực tế)
          </div>
        </v-col>

        <v-col cols="12" md="8">
          <div
            v-for="star in [5, 4, 3, 2, 1]"
            :key="star"
            class="d-flex align-center ga-2 mb-1"
          >
            <span class="text-caption font-weight-bold text-grey-darken-2" style="width: 45px">
              {{ star }} sao
            </span>
            <v-icon icon="mdi-star" size="14" color="amber-darken-2" />
            <v-progress-linear
              :model-value="getPercent(star)"
              color="amber-darken-2"
              bg-color="grey-lighten-2"
              height="8"
              rounded
              class="flex-grow-1"
            />
            <span class="text-caption text-grey text-end" style="width: 40px">
              {{ getCount(star) }}
            </span>
          </div>
        </v-col>
      </v-row>
    </v-card>

    <v-divider class="mb-5" />

    <div v-if="loading" class="text-center py-6 text-grey">
      <v-progress-circular indeterminate color="primary" size="32" class="me-2" />
      <span>Đang tải nhận xét...</span>
    </div>

    <div v-else-if="reviews.length === 0" class="text-center py-8">
      <v-icon icon="mdi-comment-text-outline" size="48" color="grey-lighten-1" class="mb-2" />
      <p class="text-body-1 text-grey-darken-1 ma-0">
        Chưa có đánh giá nào cho cuốn sách này.
      </p>
      <p class="text-caption text-grey mt-1">
        Hãy mua và là người đầu tiên chia sẻ cảm nhận của bạn!
      </p>
    </div>

    <div v-else class="reviews-list">
      <div
        v-for="item in reviews"
        :key="item.id"
        class="review-item pb-4 mb-4 border-b"
      >
        <div class="d-flex align-start justify-space-between flex-wrap ga-2">
          <!-- Người đánh giá & Rating -->
          <div class="d-flex align-center ga-3">
            <v-avatar size="42" color="primary" class="elevation-1">
              <v-img v-if="item.userAvatar" :src="item.userAvatar" alt="Avatar" cover />
              <span v-else class="text-white text-subtitle-2 font-weight-bold">
                {{ getAvatarInitials(item.userFullName) }}
              </span>
            </v-avatar>

            <div>
              <div class="d-flex align-center ga-2 flex-wrap">
                <span class="font-weight-bold text-subtitle-2 text-grey-darken-3">
                  {{ item.userFullName || 'Khách hàng' }}
                </span>
                <v-chip size="x-small" color="success" variant="flat" prepend-icon="mdi-check-decagram">
                  Đã mua hàng
                </v-chip>
              </div>

              <div class="d-flex align-center ga-2 mt-1">
                <v-rating
                  :model-value="item.ratingPoint"
                  readonly
                  size="x-small"
                  density="compact"
                  active-color="amber-darken-3"
                  color="grey-lighten-1"
                />
                <span class="text-caption text-grey">
                  {{ formatDate(item.createdAt) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Nút xóa dành riêng cho Admin -->
          <v-btn
            v-if="authStore.isAdmin"
            icon="mdi-delete-outline"
            size="small"
            variant="text"
            color="error"
            title="Xóa đánh giá này (Dành cho Admin)"
            @click="handleDeleteReview(item.id)"
          />
        </div>

        <!-- Nội dung nhận xét -->
        <p class="text-body-2 text-grey-darken-3 mt-3 mb-0 ps-12" style="white-space: pre-line; line-height: 1.6;">
          {{ item.content }}
        </p>
      </div>

      <!-- Phân trang -->
      <div v-if="totalPages > 1" class="d-flex justify-center mt-5">
        <v-pagination
          v-model="currentPage"
          :length="totalPages"
          :total-visible="5"
          density="comfortable"
          color="primary"
          @update:model-value="loadReviews"
        />
      </div>
    </div>
  </v-card>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import reviewService from '@/services/review.service';
import { useAuthStore } from '@/stores/auth';
import { useToast } from 'vue-toastification';

const props = defineProps({
  bookId: {
    type: [Number, String],
    required: true,
  },
});

const authStore = useAuthStore();
const toast = useToast();

const reviews = ref([]);
const summary = ref({
  avgRating: 0,
  totalReviews: 0,
  star5Count: 0,
  star4Count: 0,
  star3Count: 0,
  star2Count: 0,
  star1Count: 0,
});

const loading = ref(false);
const currentPage = ref(1);
const totalPages = ref(1);
const pageSize = 5;

const loadSummary = async () => {
  if (!props.bookId) return;
  try {
    const res = await reviewService.getReviewSummary(props.bookId);
    if (res.data) {
      summary.value = res.data;
    }
  } catch (err) {
    console.error('Lỗi tải thống kê đánh giá:', err);
  }
};

const loadReviews = async () => {
  if (!props.bookId) return;
  loading.value = true;
  try {
    const pageIndex = currentPage.value - 1;
    const res = await reviewService.getReviewsByBook(props.bookId, {
      page: pageIndex,
      size: pageSize,
    });
    const pageData = res.data;
    if (pageData) {
      reviews.value = pageData.items || [];
      totalPages.value = pageData.totalPages || 1;
    }
  } catch (err) {
    console.error('Lỗi tải danh sách đánh giá:', err);
  } finally {
    loading.value = false;
  }
};

const getCount = (star) => {
  switch (star) {
    case 5: return summary.value.star5Count || 0;
    case 4: return summary.value.star4Count || 0;
    case 3: return summary.value.star3Count || 0;
    case 2: return summary.value.star2Count || 0;
    case 1: return summary.value.star1Count || 0;
    default: return 0;
  }
};

const getPercent = (star) => {
  if (!summary.value.totalReviews || summary.value.totalReviews === 0) return 0;
  return (getCount(star) / summary.value.totalReviews) * 100;
};

const getAvatarInitials = (fullName) => {
  if (!fullName) return 'U';
  const parts = fullName.trim().split(' ');
  return parts[parts.length - 1].charAt(0).toUpperCase();
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const handleDeleteReview = async (id) => {
  if (!confirm('Bạn có chắc chắn muốn xóa đánh giá này không?')) return;
  try {
    await reviewService.deleteReview(id);
    toast.success('Đã xóa đánh giá thành công.');
    await Promise.all([loadSummary(), loadReviews()]);
  } catch (err) {
    toast.error('Lỗi khi xóa đánh giá: ' + (err.response?.data?.message || err.message));
  }
};

watch(() => props.bookId, () => {
  currentPage.value = 1;
  loadSummary();
  loadReviews();
});

onMounted(() => {
  loadSummary();
  loadReviews();
});
</script>

<style scoped>
.review-item:last-child {
  border-bottom: none !important;
  margin-bottom: 0 !important;
  padding-bottom: 0 !important;
}
</style>
