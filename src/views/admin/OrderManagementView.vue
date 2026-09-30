<template>
  <div class="ma-4">
    <!-- Header -->
    <v-card elevation="1" rounded="lg" class="pa-4 mb-4">
      <div class="d-flex justify-space-between align-center flex-wrap ga-3">
        <div>
          <h1 class="text-h4 font-weight-bold ma-0">Quản Lý Đơn Hàng</h1>
          <p class="text-body-2 text-grey-darken-1 mt-1 mb-0">
            Theo dõi, xử lý và cập nhật trạng thái đơn hàng của khách hàng
          </p>
        </div>

        <div class="d-flex align-center ga-3">
          <v-btn
            color="primary"
            variant="outlined"
            prepend-icon="mdi-refresh"
            :loading="loading"
            @click="loadOrders"
          >
            Làm mới
          </v-btn>
        </div>
      </div>

      <!-- Filter tabs -->
      <v-tabs v-model="activeTab" color="primary" class="mt-4 border-b">
        <v-tab value="ALL">Tất cả ({{ orders.length }})</v-tab>
        <v-tab value="PENDING">Chờ xác nhận ({{ countByStatus('PENDING') }})</v-tab>
        <v-tab value="CONFIRMED">Đã xác nhận ({{ countByStatus('CONFIRMED') }})</v-tab>
        <v-tab value="SHIPPING">Đang giao ({{ countByStatus('SHIPPING') }})</v-tab>
        <v-tab value="DELIVERED">Đã giao ({{ countByStatus('DELIVERED') }})</v-tab>
        <v-tab value="CANCELED">Đã hủy ({{ countByStatus('CANCELED') }})</v-tab>
      </v-tabs>
    </v-card>

    <!-- Table -->
    <v-card elevation="1" rounded="lg">
      <v-table hover>
        <thead>
          <tr>
            <th class="text-center font-weight-bold">#</th>
            <th class="font-weight-bold">Mã đơn / Ngày đặt</th>
            <th class="font-weight-bold">Sản phẩm chính</th>
            <th class="text-center font-weight-bold">Số lượng</th>
            <th class="text-end font-weight-bold">Tổng tiền</th>
            <th class="text-center font-weight-bold">Thanh toán</th>
            <th class="text-center font-weight-bold">Trạng thái</th>
            <th class="text-center font-weight-bold">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td colspan="8" class="text-center py-6 text-grey">
              <v-progress-circular indeterminate color="primary" size="28" class="me-2" />
              Đang tải danh sách đơn hàng...
            </td>
          </tr>
          <tr v-else-if="filteredOrders.length === 0">
            <td colspan="8" class="text-center py-8 text-grey">
              Không tìm thấy đơn hàng nào.
            </td>
          </tr>
          <tr v-for="(order, index) in filteredOrders" :key="order.id">
            <!-- Index -->
            <td class="text-center text-caption text-grey">{{ index + 1 }}</td>

            <!-- Order Code & Date -->
            <td>
              <div class="font-weight-bold text-primary">#{{ order.orderCode || order.id }}</div>
              <div class="text-caption text-grey">{{ formatDate(order.createdAt) }}</div>
            </td>

            <!-- First Book -->
            <td>
              <div class="d-flex align-center py-1">
                <v-img
                  :src="order.firstBookImage || '/images/default_book.png'"
                  width="36"
                  height="48"
                  cover
                  class="rounded me-2 bg-grey-lighten-2 flex-shrink-0"
                />
                <span class="text-body-2 font-weight-medium text-truncate" style="max-width: 220px">
                  {{ order.firstBookName || 'Đơn hàng sách' }}
                </span>
              </div>
            </td>

            <!-- Quantity -->
            <td class="text-center">
              <v-chip size="small" variant="tonal">{{ order.totalItems }} cuốn</v-chip>
            </td>

            <!-- Total Price -->
            <td class="text-end font-weight-bold text-red">
              {{ formatPrice(order.totalPrice) }} đ
            </td>

            <!-- Payment -->
            <td class="text-center text-caption">
              <div>{{ order.paymentName || 'COD' }}</div>
              <div class="text-grey">{{ order.deliveryName }}</div>
            </td>

            <!-- Status -->
            <td class="text-center">
              <v-chip :color="getStatusColor(order.status)" size="small" variant="flat" class="font-weight-medium">
                {{ getStatusText(order.status) }}
              </v-chip>
            </td>

            <!-- Actions -->
            <td class="text-center">
              <div class="d-flex justify-center ga-1">
                <v-btn
                  size="small"
                  variant="outlined"
                  color="info"
                  prepend-icon="mdi-eye"
                  @click="openOrderDetail(order.id)"
                >
                  Chi tiết
                </v-btn>
                <v-btn
                  size="small"
                  variant="flat"
                  color="warning"
                  prepend-icon="mdi-pencil"
                  @click="openStatusDialog(order)"
                >
                  Trạng thái
                </v-btn>
              </div>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>

    <!-- Dialog: Chi tiết đơn hàng -->
    <v-dialog v-model="detailDialog" max-width="700">
      <v-card v-if="selectedOrderDetail" class="rounded-xl">
        <v-card-title class="d-flex justify-space-between align-center pa-4 bg-grey-lighten-4">
          <span class="font-weight-bold text-h6">
            Chi tiết đơn hàng #{{ selectedOrderDetail.orderCode || selectedOrderDetail.id }}
          </span>
          <v-btn icon="mdi-close" variant="text" size="small" @click="detailDialog = false" />
        </v-card-title>

        <v-card-text class="pa-4">
          <v-row class="mb-2">
            <v-col cols="12" sm="6">
              <div class="text-caption text-grey">Người nhận:</div>
              <div class="font-weight-bold">{{ selectedOrderDetail.fullName }}</div>
              <div class="text-body-2">{{ selectedOrderDetail.phone }}</div>
            </v-col>
            <v-col cols="12" sm="6">
              <div class="text-caption text-grey">Trạng thái:</div>
              <v-chip :color="getStatusColor(selectedOrderDetail.status)" size="small" variant="flat" class="mt-1">
                {{ getStatusText(selectedOrderDetail.status) }}
              </v-chip>
            </v-col>
            <v-col cols="12">
              <div class="text-caption text-grey">Địa chỉ giao hàng:</div>
              <div class="text-body-2">{{ selectedOrderDetail.deliveryAddress }}</div>
            </v-col>
            <v-col cols="12" v-if="selectedOrderDetail.note">
              <div class="text-caption text-grey">Ghi chú:</div>
              <div class="text-body-2 italic text-grey-darken-2">{{ selectedOrderDetail.note }}</div>
            </v-col>
          </v-row>

          <v-divider class="my-3" />

          <!-- Order items -->
          <div class="font-weight-bold mb-2">Danh sách sản phẩm</div>
          <div
            v-for="item in selectedOrderDetail.orderDetails || []"
            :key="item.id"
            class="d-flex align-center justify-space-between py-2 border-b"
          >
            <div class="d-flex align-center">
              <v-img
                :src="item.bookImage || '/images/default_book.png'"
                width="40"
                height="56"
                cover
                class="rounded me-3 bg-grey-lighten-2 flex-shrink-0"
              />
              <div>
                <div class="font-weight-medium text-body-2">{{ item.bookName }}</div>
                <div class="text-caption text-grey">
                  {{ item.quantity }} x {{ formatPrice(item.price) }} đ
                </div>
              </div>
            </div>
            <div class="font-weight-bold text-red text-body-2">
              {{ formatPrice(item.subTotal ?? item.price * item.quantity) }} đ
            </div>
          </div>

          <!-- Total Calculation -->
          <div class="mt-4 bg-grey-lighten-5 pa-3 rounded">
            <div class="d-flex justify-space-between text-body-2 mb-1">
              <span>Tiền hàng:</span>
              <span>{{ formatPrice(selectedOrderDetail.totalPriceProduct) }} đ</span>
            </div>
            <div class="d-flex justify-space-between text-body-2 mb-1">
              <span>Phí vận chuyển:</span>
              <span>{{ formatPrice(selectedOrderDetail.feeDelivery) }} đ</span>
            </div>
            <div class="d-flex justify-space-between text-body-2 mb-2">
              <span>Phí thanh toán:</span>
              <span>{{ formatPrice(selectedOrderDetail.feePayment) }} đ</span>
            </div>
            <v-divider class="mb-2" />
            <div class="d-flex justify-space-between font-weight-bold text-subtitle-1">
              <span>Tổng thanh toán:</span>
              <span class="text-red">{{ formatPrice(selectedOrderDetail.totalPrice) }} đ</span>
            </div>
          </div>
        </v-card-text>

        <v-card-actions class="pa-4 pt-0 justify-end">
          <v-btn variant="outlined" @click="detailDialog = false">Đóng</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog: Cập nhật trạng thái -->
    <v-dialog v-model="statusDialog" max-width="450">
      <v-card class="rounded-xl">
        <v-card-title class="font-weight-bold pa-4 border-b">
          Cập nhật trạng thái đơn hàng
        </v-card-title>
        <v-card-text class="pa-4">
          <p class="text-body-2 mb-3">
            Đơn hàng: <b>#{{ targetOrder?.orderCode || targetOrder?.id }}</b>
          </p>
          <v-select
            v-model="newStatus"
            :items="statusOptions"
            item-title="label"
            item-value="value"
            label="Chọn trạng thái mới"
            variant="outlined"
            density="comfortable"
          />
        </v-card-text>
        <v-card-actions class="pa-4 pt-0 justify-end ga-2">
          <v-btn variant="outlined" @click="statusDialog = false" :disabled="updatingStatus">Hủy</v-btn>
          <v-btn color="primary" class="font-weight-bold" :loading="updatingStatus" @click="submitStatusUpdate">
            Xác nhận
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useToast } from 'vue-toastification';
import orderService from '@/services/order.service';

const toast = useToast();

const orders = ref([]);
const loading = ref(false);
const activeTab = ref('ALL');

const detailDialog = ref(false);
const selectedOrderDetail = ref(null);

const statusDialog = ref(false);
const targetOrder = ref(null);
const newStatus = ref('PENDING');
const updatingStatus = ref(false);

const statusOptions = [
  { label: 'Chờ xác nhận (PENDING)', value: 'PENDING' },
  { label: 'Đã xác nhận (CONFIRMED)', value: 'CONFIRMED' },
  { label: 'Đang giao hàng (SHIPPING)', value: 'SHIPPING' },
  { label: 'Đã giao hàng (DELIVERED)', value: 'DELIVERED' },
  { label: 'Hủy đơn hàng (CANCELED)', value: 'CANCELED' }
];

const loadOrders = async () => {
  loading.value = true;
  try {
    const res = await orderService.getAllOrdersForAdmin();
    orders.value = res.data || res || [];
  } catch (error) {
    toast.error('Không thể tải danh sách đơn hàng.');
  } finally {
    loading.value = false;
  }
};

const countByStatus = (status) => {
  return orders.value.filter(o => o.status === status).length;
};

const filteredOrders = computed(() => {
  if (activeTab.value === 'ALL') return orders.value;
  return orders.value.filter(o => o.status === activeTab.value);
});

const openOrderDetail = async (orderId) => {
  try {
    const res = await orderService.getOrderById(orderId);
    selectedOrderDetail.value = res.data || res;
    detailDialog.value = true;
  } catch (error) {
    toast.error('Không thể tải chi tiết đơn hàng.');
  }
};

const openStatusDialog = (order) => {
  targetOrder.value = order;
  newStatus.value = order.status;
  statusDialog.value = true;
};

const submitStatusUpdate = async () => {
  if (!targetOrder.value) return;
  updatingStatus.value = true;
  try {
    await orderService.updateOrderStatus(targetOrder.value.id, newStatus.value);
    toast.success('Cập nhật trạng thái thành công!');
    statusDialog.value = false;
    await loadOrders();
  } catch (error) {
    toast.error(error.response?.data?.message || 'Cập nhật trạng thái thất bại.');
  } finally {
    updatingStatus.value = false;
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'PENDING': return 'warning';
    case 'CONFIRMED': return 'info';
    case 'SHIPPING': return 'primary';
    case 'DELIVERED': return 'success';
    case 'CANCELED': return 'error';
    default: return 'grey';
  }
};

const getStatusText = (status) => {
  switch (status) {
    case 'PENDING': return 'Chờ xác nhận';
    case 'CONFIRMED': return 'Đã xác nhận';
    case 'SHIPPING': return 'Đang giao hàng';
    case 'DELIVERED': return 'Đã giao thành công';
    case 'CANCELED': return 'Đã hủy';
    default: return status || 'Không rõ';
  }
};

const formatPrice = (val) => new Intl.NumberFormat('vi-VN').format(Number(val) || 0);

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
};

onMounted(() => {
  loadOrders();
});
</script>

<style scoped>
:deep(thead th) {
  background-color: #143d8f !important;
  color: white !important;
  font-size: 13px !important;
}
</style>
