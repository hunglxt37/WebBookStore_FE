<template>
  <div class="orders-page">
    <h2 class="text-h5 font-weight-bold mb-6">
      Lịch sử đơn hàng
    </h2>

    <!-- Loading -->
    <div v-if="orderStore.loading" class="d-flex justify-center py-10">
      <v-progress-circular indeterminate size="50" color="primary" />
    </div>

    <!-- Không có đơn hàng -->
    <v-alert v-else-if="!orderStore.orders || orderStore.orders.length === 0" type="info" variant="tonal">
      Bạn chưa có đơn hàng nào.
    </v-alert>

    <!-- Danh sách đơn hàng -->
    <div v-else>
      <v-card
        v-for="order in orderStore.orders"
        :key="order.id"
        class="mb-4"
        rounded="lg"
        elevation="2"
      >
        <v-card-item>
          <template #prepend>
            <v-avatar size="80" rounded="lg" class="bg-grey-lighten-3 me-3">
              <v-img :src="order.firstBookImage" cover>
                <template #error>
                  <v-icon color="grey">mdi-book</v-icon>
                </template>
              </v-img>
            </v-avatar>
          </template>

          <v-card-title class="font-weight-bold">
            Đơn hàng #{{ order.orderCode || order.id }}
          </v-card-title>

          <v-card-subtitle>
            {{ formatDate(order.createdAt) }}
          </v-card-subtitle>

          <template #append>
            <v-chip :color="getStatusColor(order.status)" variant="tonal" size="small">
              {{ getStatusText(order.status) }}
            </v-chip>
          </template>
        </v-card-item>

        <v-divider />

        <v-card-text>
          <v-row>
            <!-- Sản phẩm -->
            <v-col cols="12" md="5">
              <div class="text-caption text-grey">Sản phẩm</div>
              <div class="font-weight-medium">{{ order.firstBookName || 'Sách đã mua' }}</div>
              <div class="text-body-2 text-grey mt-1">{{ order.totalItems }} sản phẩm</div>
            </v-col>

            <!-- Giao hàng -->
            <v-col cols="12" md="3">
              <div class="text-caption text-grey">Giao hàng</div>
              <div class="text-body-2">{{ order.deliveryName || 'Tiêu chuẩn' }}</div>
            </v-col>

            <!-- Thanh toán -->
            <v-col cols="12" md="2">
              <div class="text-caption text-grey">Thanh toán</div>
              <div class="text-body-2">{{ order.paymentName || 'COD' }}</div>
            </v-col>

            <!-- Tổng tiền -->
            <v-col cols="12" md="2" class="text-md-right">
              <div class="text-caption text-grey">Tổng tiền</div>
              <div class="text-h6 font-weight-bold text-primary">
                {{ formatPrice(order.totalPrice) }} đ
              </div>
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider />

        <!-- Actions -->
        <v-card-actions class="pa-4 flex-wrap ga-2">
          <v-btn
            variant="outlined"
            color="primary"
            prepend-icon="mdi-eye-outline"
            @click="viewOrder(order.id)"
          >
            Xem chi tiết
          </v-btn>

          <!-- Nút Đánh giá nếu đơn hàng đã giao thành công -->
          <v-btn
            v-if="order.status === 'DELIVERED'"
            variant="tonal"
            color="amber-darken-3"
            prepend-icon="mdi-star-outline"
            class="font-weight-bold text-none"
            @click="viewOrder(order.id)"
          >
            Đánh giá sản phẩm
          </v-btn>

          <v-spacer />

          <!-- Hủy đơn -->
          <v-btn
            v-if="order.status === 'PENDING'"
            variant="outlined"
            color="error"
            prepend-icon="mdi-delete-outline"
            @click="cancelOrder(order.id)"
          >
            Hủy đơn
          </v-btn>
        </v-card-actions>
      </v-card>
    </div>

    <!-- Component Dialog: Chi tiết đơn hàng -->
    <order-detail-dialog
      v-model="showDetailDialog"
      :order="selectedOrder"
      @open-review="openReviewDialog"
    />

    <!-- Component Dialog: Đánh giá sản phẩm -->
    <review-dialog
      v-model="showReviewDialog"
      :item="reviewItem"
      @reviewed="handleReviewed"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useOrderStore } from '@/stores/order.store';
import OrderDetailDialog from '@/components/orders/OrderDetailDialog.vue';
import ReviewDialog from '@/components/orders/ReviewDialog.vue';

const orderStore = useOrderStore();

const showDetailDialog = ref(false);
const selectedOrder = ref(null);

const showReviewDialog = ref(false);
const reviewItem = ref(null);

onMounted(async () => {
  await orderStore.getMyOrders();
});

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

const viewOrder = async (orderId) => {
  const order = await orderStore.getOrderById(orderId);
  selectedOrder.value = order;
  showDetailDialog.value = true;
};

const cancelOrder = async (orderId) => {
  const confirmDelete = confirm('Bạn có chắc chắn muốn hủy đơn hàng này không?');
  if (!confirmDelete) return;

  try {
    await orderStore.cancelOrder(orderId, 'Khách hàng yêu cầu hủy đơn');
    await orderStore.getMyOrders();
  } catch (error) {
    console.error('Cancel order error:', error);
  }
};

const openReviewDialog = (item) => {
  reviewItem.value = item;
  showReviewDialog.value = true;
};

const handleReviewed = (orderDetailId) => {
  if (selectedOrder.value?.orderDetails) {
    const found = selectedOrder.value.orderDetails.find((d) => d.id === orderDetailId);
    if (found) {
      found.isReview = true;
    }
  }
  orderStore.getMyOrders();
};
</script>

<style scoped>
.orders-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}
</style>