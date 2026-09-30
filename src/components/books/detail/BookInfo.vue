<template>
  <v-card class="pa-6 rounded-xl book-info-card" elevation="1">
    <v-row class="mb-2" align="start">
      <v-col cols="12" sm="7" class="pt-0">
        <h1 class="text-h5 font-weight-bold text-primary mt-0 mb-1 line-clamp-2">
          {{ props.book.name }}
        </h1>

        <div class="d-flex align-center ga-2 text-body-2">
          <v-rating
            :model-value="props.book.avgRating || 0"
            readonly
            half-increments
            active-color="amber-darken-3"
            color="grey-lighten-1"
            density="compact"
            size="small"
          />
          <span class="font-weight-bold text-amber-darken-3">
            {{ props.book.avgRating ? props.book.avgRating.toFixed(1) : '5.0' }}
          </span>
        </div>
      </v-col>

      <v-col cols="12" sm="5" class="border-s ps-4 pt-0">
        <div class="d-flex align-center ga-1 mb-1">
          <span class="text-caption text-grey-darken-1 font-weight-medium">Thể loại:</span>
          <v-chip
            v-for="genre in props.book.genres"
            :key="genre.id || genre"
            size="small"
            color="primary"
            variant="tonal"
            class="font-weight-medium"
          >
            {{ genre.name || genre }}
          </v-chip>
          <v-chip
            v-if="props.book.soldQuantity > 10"
            size="small"
            color="amber-darken-3"
            variant="flat"
            class="font-weight-bold"
          >
            Bán chạy
          </v-chip>
        </div>

        <div class="text-body-2 text-grey-darken-1">
          Đã bán: <b class="text-grey-darken-3 font-weight-bold">{{ props.book.soldQuantity || 0 }} cuốn</b>
        </div>
      </v-col>
    </v-row>

    <div class="price-box pa-4 rounded-lg my-4 bg-surface-light d-flex align-baseline flex-wrap ga-3">
      <span class="text-h4 font-weight-bold text-red-darken-2">
        {{ formatPrice(props.book.sellPrice) }} đ
      </span>
      <span
        v-if="props.book.listPrice && props.book.listPrice > props.book.sellPrice"
        class="text-body-1 text-grey text-decoration-line-through"
      >
        {{ formatPrice(props.book.listPrice) }} đ
      </span>
      <v-chip
        v-if="discountPercent(props.book.listPrice, props.book.sellPrice) > 0"
        size="small"
        color="red-darken-2"
        variant="flat"
        class="font-weight-bold"
      >
        -{{ discountPercent(props.book.listPrice, props.book.sellPrice) }}%
      </v-chip>
    </div>

    <div class="spec-grid pa-4 rounded-lg mb-4 border">
      <div class="text-subtitle-2 font-weight-bold text-primary mb-2 d-flex align-center ga-1">
        <v-icon icon="mdi-information-outline" size="18" />
        <span>Thông tin chi tiết</span>
      </div>
      <v-row dense class="text-body-2">
        <v-col cols="12" sm="6">
          <div class="d-flex align-center py-1">
            <span class="text-grey-darken-1 me-2" style="min-width: 90px">Tác giả:</span>
            <span class="font-weight-medium text-grey-darken-4">{{ props.book.author || 'Đang cập nhật' }}</span>
          </div>
        </v-col>
        <v-col cols="12" sm="6">
          <div class="d-flex align-center py-1">
            <span class="text-grey-darken-1 me-2" style="min-width: 90px">Tình trạng:</span>
            <v-chip
              :color="props.book.quantity > 0 ? 'success' : 'error'"
              size="x-small"
              variant="tonal"
              class="font-weight-bold"
            >
              {{ props.book.quantity > 0 ? `Còn hàng (${props.book.quantity})` : 'Hết hàng' }}
            </v-chip>
          </div>
        </v-col>
        <v-col cols="12" sm="6">
          <div class="d-flex align-center py-1">
            <span class="text-grey-darken-1 me-2" style="min-width: 90px">Mã ISBN:</span>
            <span class="font-weight-medium text-grey-darken-4">{{ props.book.isbn || 'Chưa cập nhật' }}</span>
          </div>
        </v-col>
        <v-col cols="12" sm="6">
          <div class="d-flex align-center py-1">
            <span class="text-grey-darken-1 me-2" style="min-width: 90px">Kinh doanh:</span>
            <v-chip
              :color="props.book.status === 'ACTIVE' ? 'success' : 'grey'"
              size="x-small"
              variant="flat"
            >
              {{ props.book.status === 'ACTIVE' ? 'Đang mở bán' : 'Tạm ngưng' }}
            </v-chip>
          </div>
        </v-col>
      </v-row>
    </div>

    <div class="description-box mb-5">
      <div class="text-subtitle-2 font-weight-bold text-primary mb-1 d-flex align-center ga-1">
        <v-icon icon="mdi-text-box-outline" size="18" />
        <span>Mô tả sản phẩm</span>
      </div>
      <p
        class="text-body-2 text-grey-darken-2 mb-0"
        :class="{ 'description-clamp': !showFullDescription }"
        style="white-space: pre-line; line-height: 1.6;"
      >
        {{ props.book.description || 'Chưa có thông tin mô tả chi tiết cho tựa sách này.' }}
      </p>
      <v-btn
        v-if="props.book.description && props.book.description.length > 200"
        variant="text"
        density="compact"
        color="primary"
        class="px-0 mt-1 font-weight-bold text-caption"
        @click="showFullDescription = !showFullDescription"
      >
        {{ showFullDescription ? 'Thu gọn ▲' : 'Xem thêm ▼' }}
      </v-btn>
    </div>

    <v-divider class="mb-4" />

    <div class="d-flex align-center justify-space-between flex-wrap ga-3 mb-4">
      <span class="text-subtitle-2 font-weight-medium text-grey-darken-3">Số lượng:</span>
      <div class="quantity-controller d-flex align-center border rounded-lg">
        <v-btn
          icon="mdi-minus"
          variant="text"
          size="small"
          density="comfortable"
          :disabled="quantity <= 1 || props.book.quantity <= 0"
          @click="decrease"
        />
        <input
          v-model.number="quantity"
          type="number"
          class="qty-input text-center font-weight-bold"
          min="1"
          :max="props.book.quantity || 1"
        />
        <v-btn
          icon="mdi-plus"
          variant="text"
          size="small"
          density="comfortable"
          :disabled="props.book.quantity !== undefined && quantity >= props.book.quantity"
          @click="increase"
        />
      </div>
    </div>

    <v-row dense class="mb-4">
      <v-col cols="12" sm="6">
        <v-btn
          block
          size="large"
          variant="outlined"
          color="primary"
          prepend-icon="mdi-cart-plus"
          class="font-weight-bold rounded-lg text-none"
          :disabled="props.book.quantity <= 0 || props.book.status === 'INACTIVE'"
          @click="AddCart"
        >
          Thêm vào giỏ
        </v-btn>
      </v-col>
      <v-col cols="12" sm="6">
        <v-btn
          block
          size="large"
          variant="flat"
          color="red-darken-2"
          prepend-icon="mdi-lightning-bolt"
          class="font-weight-bold rounded-lg text-none text-white shadow-sm"
          :disabled="props.book.quantity <= 0 || props.book.status === 'INACTIVE'"
          @click="BuyNow"
        >
          Mua ngay
        </v-btn>
      </v-col>
    </v-row>

    <div class="policy-box pt-3 border-t d-flex align-center justify-space-between flex-wrap ga-2 text-caption text-grey-darken-1">
      <div class="d-flex align-center ga-1">
        <v-icon icon="mdi-shield-check" color="success" size="16" />
        <span>100% Chính hãng</span>
      </div>
      <div class="d-flex align-center ga-1">
        <v-icon icon="mdi-truck-fast-outline" color="primary" size="16" />
        <span>Giao hàng toàn quốc</span>
      </div>
      <div class="d-flex align-center ga-1">
        <v-icon icon="mdi-keyboard-return" color="amber-darken-3" size="16" />
        <span>Đổi trả 7 ngày</span>
      </div>
    </div>
  </v-card>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  book: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['them-gio-hang', 'mua-ngay']);

const quantity = ref(1);
const showFullDescription = ref(false);

const increase = () => {
  if (props.book.quantity && quantity.value < props.book.quantity) {
    quantity.value++;
  } else if (!props.book.quantity) {
    quantity.value++;
  }
};

const decrease = () => {
  if (quantity.value > 1) {
    quantity.value--;
  }
};

const AddCart = () => {
  emit('them-gio-hang', {
    bookId: props.book.id,
    quantity: quantity.value,
  });
};

const BuyNow = () => {
  emit('mua-ngay', {
    bookId: props.book.id,
    quantity: quantity.value,
  });
};

const discountPercent = (listPrice, sellPrice) => {
  if (!listPrice || listPrice <= sellPrice) {
    return 0;
  }
  return Math.round(((listPrice - sellPrice) / listPrice) * 100);
};

const formatPrice = (price) => new Intl.NumberFormat('vi-VN').format(price || 0);
</script>

<style scoped>
.book-info-card {
  border: 1px solid #e2e8f0;
}
.price-box {
  background-color: #f8fafc;
  border: 1px dashed #cbd5e1;
}
.spec-grid {
  background-color: #fafbfd;
  border-color: #e2e8f0 !important;
}
.qty-input {
  width: 50px;
  border: none;
  outline: none;
  font-size: 15px;
}
.qty-input::-webkit-inner-spin-button,
.qty-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.description-clamp {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>