<template>
  <app-dialog
    v-model="model"
    :title="`Chi tiết đơn hàng #${order?.orderCode || order?.id || ''}`"
    max-width="850"
    :show-submit="false"
    cancel-text="Đóng"
  >
    <div v-if="order">
      <!-- Trạng thái & Thời gian -->
      <div class="d-flex justify-space-between align-center mb-4">
        <div class="text-caption text-grey">
          Thời gian đặt: {{ formatDate(order.createdAt) }}
        </div>
        <v-chip :color="getStatusColor(order.status)" size="small">
          {{ getStatusText(order.status) }}
        </v-chip>
      </div>

      <!-- Thông tin giao hàng & Phương thức -->
      <v-row class="mb-4">
        <v-col cols="12" md="6">
          <div class="border rounded pa-3 h-100">
            <div class="font-weight-bold mb-2 text-subtitle-2 text-primary">Thông tin nhận hàng</div>
            <div class="text-body-2"><strong>Họ tên:</strong> {{ order.fullName }}</div>
            <div class="text-body-2"><strong>Số điện thoại:</strong> {{ order.phone }}</div>
            <div class="text-body-2"><strong>Địa chỉ:</strong> {{ order.deliveryAddress }}</div>
            <div v-if="order.note" class="text-body-2 text-grey-darken-1 mt-1">
              <strong>Ghi chú:</strong> {{ order.note }}
            </div>
          </div>
        </v-col>
        <v-col cols="12" md="6">
          <div class="border rounded pa-3 h-100">
            <div class="font-weight-bold mb-2 text-subtitle-2 text-primary">Phương thức</div>
            <div class="text-body-2"><strong>Vận chuyển:</strong> {{ order.deliveryName }}</div>
            <div class="text-body-2"><strong>Thanh toán:</strong> {{ order.paymentName }}</div>
          </div>
        </v-col>
      </v-row>

      <!-- Danh sách sản phẩm -->
      <div class="font-weight-bold mb-2 text-subtitle-2 text-primary">Sản phẩm trong đơn</div>
      <v-table density="comfortable" class="border rounded mb-4">
        <thead>
          <tr class="bg-grey-lighten-4">
            <th>#</th>
            <th>Hình ảnh</th>
            <th>Tên sách</th>
            <th class="text-end">Đơn giá</th>
            <th class="text-center">Số lượng</th>
            <th class="text-end">Thành tiền</th>
            <th class="text-center">Đánh giá</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, idx) in order.orderDetails" :key="item.id">
            <td>{{ idx + 1 }}</td>
            <td>
              <v-img :src="item.bookImage" width="40" height="55" cover class="rounded my-1 bg-grey-lighten-2">
                <template #error>
                  <v-icon size="small">mdi-book</v-icon>
                </template>
              </v-img>
            </td>
            <td class="font-weight-medium">{{ item.bookName }}</td>
            <td class="text-end">{{ formatPrice(item.price) }} đ</td>
            <td class="text-center">{{ item.quantity }}</td>
            <td class="text-end text-red font-weight-bold">{{ formatPrice(item.subTotal) }} đ</td>
            <td class="text-center">
              <template v-if="order.status === 'DELIVERED'">
                <v-chip
                  v-if="item.isReview"
                  size="small"
                  color="success"
                  variant="tonal"
                  prepend-icon="mdi-check"
                  class="font-weight-medium"
                >
                  Đã đánh giá
                </v-chip>
                <v-btn
                  v-else
                  size="small"
                  color="amber-darken-3"
                  variant="flat"
                  prepend-icon="mdi-star"
                  class="text-white font-weight-bold text-none"
                  @click="emit('open-review', item)"
                >
                  Đánh giá
                </v-btn>
              </template>
              <span v-else class="text-caption text-grey">-</span>
            </td>
          </tr>
        </tbody>
      </v-table>

      <!-- Tổng thanh toán -->
      <div class="d-flex flex-column align-end ga-1">
        <div class="text-body-2">Tiền hàng: <strong>{{ formatPrice(order.totalPriceProduct) }} đ</strong></div>
        <div class="text-body-2">Phí vận chuyển: <strong>{{ formatPrice(order.feeDelivery) }} đ</strong></div>
        <div class="text-body-2">Phí thanh toán: <strong>{{ formatPrice(order.feePayment) }} đ</strong></div>
        <v-divider class="my-2" style="width: 250px" />
        <div class="text-h6 font-weight-bold text-red">
          Tổng thanh toán: {{ formatPrice(order.totalPrice) }} đ
        </div>
      </div>
    </div>
  </app-dialog>
</template>

<script setup>
import AppDialog from '@/components/common/AppDialog.vue';

const model = defineModel({
  type: Boolean,
  default: false,
});

defineProps({
  order: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['open-review']);

const formatPrice = (price) => new Intl.NumberFormat('vi-VN').format(Number(price) || 0);

const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleString('vi-VN');
};

const getStatusText = (status) => {
  const statusMap = {
    PENDING: 'Chờ xác nhận',
    CONFIRMED: 'Đã xác nhận',
    SHIPPING: 'Đang giao',
    COMPLETED: 'Hoàn thành',
    DELIVERED: 'Đã giao',
    CANCELED: 'Đã hủy',
    CANCELLED: 'Đã hủy',
  };
  return statusMap[status] || status;
};

const getStatusColor = (status) => {
  const colorMap = {
    PENDING: 'orange',
    CONFIRMED: 'blue',
    SHIPPING: 'primary',
    COMPLETED: 'green',
    DELIVERED: 'green',
    CANCELED: 'red',
    CANCELLED: 'red',
  };
  return colorMap[status] || 'grey';
};
</script>

<style scoped></style>
