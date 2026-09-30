<template>
  <app-dialog
    v-model="model"
    title="Đánh giá sản phẩm"
    max-width="540"
    submit-text="Gửi đánh giá"
    cancel-text="Hủy"
    :loading="submitting"
    @submit="handleSubmit"
  >
    <div v-if="item">
      <!-- Thông tin sản phẩm đang đánh giá -->
      <div class="d-flex align-center ga-3 mb-4 pa-3 bg-grey-lighten-4 rounded-lg">
        <v-img :src="item.bookImage" width="50" height="70" cover class="rounded bg-white">
          <template #error>
            <v-icon>mdi-book</v-icon>
          </template>
        </v-img>
        <div>
          <div class="font-weight-bold text-subtitle-2 line-clamp-2">
            {{ item.bookName }}
          </div>
          <div class="text-caption text-grey mt-1">
            Đơn giá: {{ formatPrice(item.price) }} đ
          </div>
        </div>
      </div>

      <!-- Chọn điểm số sao -->
      <div class="text-center my-4">
        <div class="text-subtitle-2 text-grey-darken-2 mb-1">
          Bạn thấy sản phẩm này thế nào?
        </div>
        <v-rating
          v-model="form.ratingPoint"
          hover
          size="large"
          density="comfortable"
          color="amber-darken-3"
          active-color="amber-darken-3"
        />
        <div class="text-subtitle-2 font-weight-bold text-amber-darken-4 mt-1">
          {{ getRatingLabel(form.ratingPoint) }}
        </div>
      </div>

      <!-- Viết nhận xét -->
      <v-textarea
        v-model="form.content"
        label="Nhận xét của bạn về sản phẩm *"
        placeholder="Hãy chia sẻ cảm nhận về nội dung sách, chất lượng in ấn, giao hàng..."
        variant="outlined"
        rows="4"
        counter="1000"
        :error-messages="errorMsg"
      />
    </div>
  </app-dialog>
</template>

<script setup>
import { ref, watch } from 'vue';
import AppDialog from '@/components/common/AppDialog.vue';
import reviewService from '@/services/review.service';
import { useToast } from 'vue-toastification';

const model = defineModel({
  type: Boolean,
  default: false,
});

const props = defineProps({
  item: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['reviewed']);
const toast = useToast();

const submitting = ref(false);
const errorMsg = ref('');
const form = ref({
  ratingPoint: 5,
  content: '',
});

watch(
  () => model.value,
  (val) => {
    if (val) {
      form.value = {
        ratingPoint: 5,
        content: '',
      };
      errorMsg.value = '';
    }
  }
);

const formatPrice = (price) => new Intl.NumberFormat('vi-VN').format(Number(price) || 0);

const getRatingLabel = (rating) => {
  switch (rating) {
    case 5: return 'Cực kỳ hài lòng (5 sao)';
    case 4: return 'Hài lòng (4 sao)';
    case 3: return 'Bình thường (3 sao)';
    case 2: return 'Chưa hài lòng (2 sao)';
    case 1: return 'Rất thất vọng (1 sao)';
    default: return `${rating} sao`;
  }
};

const handleSubmit = async () => {
  if (!form.value.content || !form.value.content.trim()) {
    errorMsg.value = 'Vui lòng nhập nội dung nhận xét của bạn.';
    return;
  }
  submitting.value = true;
  try {
    await reviewService.createReview({
      orderDetailId: props.item.id,
      ratingPoint: form.value.ratingPoint,
      content: form.value.content.trim(),
    });
    toast.success('Cảm ơn bạn đã gửi đánh giá sản phẩm!');
    emit('reviewed', props.item.id);
    model.value = false;
  } catch (err) {
    const msg = err.response?.data?.error?.message || err.response?.data?.message || err.message;
    toast.error('Gửi đánh giá thất bại: ' + msg);
  } finally {
    submitting.value = false;
  }
};
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
