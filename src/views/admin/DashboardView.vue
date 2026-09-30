<template>
  <div class="ma-4">
    <!-- Top Welcome Banner -->
    <v-card elevation="1" rounded="lg" class="pa-6 mb-6 bg-gradient-navy text-white">
      <div class="d-flex justify-space-between align-center flex-wrap ga-4">
        <div>
          <h1 class="text-h4 font-weight-bold mb-1">
            Bảng Điều Khiển Quản Trị
          </h1>
          <p class="text-body-1 opacity-90 mb-0">
            Chào mừng trở lại! Tổng quan tình hình hoạt động kinh doanh Lumina Books.
          </p>
        </div>
        <div class="d-flex ga-2">
          <v-btn color="white" variant="flat" class="text-primary font-weight-bold" to="/admin/book-management">
            <v-icon icon="mdi-book-open-page-variant" class="me-2" />
            Sách
          </v-btn>
          <v-btn color="orange" variant="flat" class="font-weight-bold text-white" to="/admin/orders">
            <v-icon icon="mdi-cart" class="me-2" />
            Đơn Hàng
          </v-btn>
        </div>
      </div>
    </v-card>

    <!-- KPI Metric Cards -->
    <v-row class="mb-4">
      <!-- Total Books -->
      <v-col cols="12" sm="6" md="3">
        <v-card elevation="1" rounded="lg" class="pa-4 stat-card">
          <div class="d-flex justify-space-between align-center">
            <div>
              <div class="text-caption text-grey font-weight-medium">TỔNG SỐ ĐẦU SÁCH</div>
              <div class="text-h4 font-weight-bold mt-1 text-primary">{{ totalBooks }}</div>
            </div>
            <v-avatar color="blue-lighten-5" size="48">
              <v-icon icon="mdi-book-multiple" color="primary" size="26" />
            </v-avatar>
          </div>
        </v-card>
      </v-col>

      <!-- Total Orders -->
      <v-col cols="12" sm="6" md="3">
        <v-card elevation="1" rounded="lg" class="pa-4 stat-card">
          <div class="d-flex justify-space-between align-center">
            <div>
              <div class="text-caption text-grey font-weight-medium">TỔNG ĐƠN HÀNG</div>
              <div class="text-h4 font-weight-bold mt-1 text-orange-darken-2">{{ orders.length }}</div>
            </div>
            <v-avatar color="orange-lighten-5" size="48">
              <v-icon icon="mdi-cart-arrow-down" color="orange-darken-2" size="26" />
            </v-avatar>
          </div>
        </v-card>
      </v-col>

      <!-- Revenue -->
      <v-col cols="12" sm="6" md="3">
        <v-card elevation="1" rounded="lg" class="pa-4 stat-card">
          <div class="d-flex justify-space-between align-center">
            <div>
              <div class="text-caption text-grey font-weight-medium">DOANH THU ƯỚC TÍNH</div>
              <div class="text-h5 font-weight-bold mt-2 text-success">{{ formatPrice(totalRevenue) }} đ</div>
            </div>
            <v-avatar color="green-lighten-5" size="48">
              <v-icon icon="mdi-currency-usd" color="success" size="26" />
            </v-avatar>
          </div>
        </v-card>
      </v-col>

      <!-- Total Genres -->
      <v-col cols="12" sm="6" md="3">
        <v-card elevation="1" rounded="lg" class="pa-4 stat-card">
          <div class="d-flex justify-space-between align-center">
            <div>
              <div class="text-caption text-grey font-weight-medium">THỂ LOẠI SÁCH</div>
              <div class="text-h4 font-weight-bold mt-1 text-purple">{{ totalGenres }}</div>
            </div>
            <v-avatar color="purple-lighten-5" size="48">
              <v-icon icon="mdi-tag-multiple" color="purple" size="26" />
            </v-avatar>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Recent Orders Table -->
    <v-card elevation="1" rounded="lg" class="pa-4">
      <div class="d-flex justify-space-between align-center mb-4">
        <div>
          <h2 class="text-h6 font-weight-bold ma-0">Đơn hàng mới nhất</h2>
          <p class="text-caption text-grey ma-0">Các đơn hàng phát sinh gần đây</p>
        </div>
        <v-btn variant="text" color="primary" to="/admin/orders">
          Xem tất cả <v-icon icon="mdi-arrow-right" class="ms-1" />
        </v-btn>
      </div>

      <v-table hover>
        <thead>
          <tr>
            <th class="font-weight-bold">Mã đơn</th>
            <th class="font-weight-bold">Ngày đặt</th>
            <th class="font-weight-bold">Sản phẩm chính</th>
            <th class="text-end font-weight-bold">Tổng tiền</th>
            <th class="text-center font-weight-bold">Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td colspan="5" class="text-center py-6 text-grey">Đang tải dữ liệu...</td>
          </tr>
          <tr v-else-if="orders.length === 0">
            <td colspan="5" class="text-center py-6 text-grey">Chưa có đơn hàng nào.</td>
          </tr>
          <tr v-for="order in recentOrders" :key="order.id">
            <td class="font-weight-bold text-primary">#{{ order.orderCode || order.id }}</td>
            <td class="text-caption text-grey">{{ formatDate(order.createdAt) }}</td>
            <td class="text-body-2 font-weight-medium">{{ order.firstBookName || 'Sản phẩm sách' }}</td>
            <td class="text-end font-weight-bold text-red">{{ formatPrice(order.totalPrice) }} đ</td>
            <td class="text-center">
              <v-chip :color="getStatusColor(order.status)" size="x-small" variant="flat">
                {{ getStatusText(order.status) }}
              </v-chip>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import orderService from '@/services/order.service';
import bookService from '@/services/book.service';
import genreService from '@/services/genre.service';

const orders = ref([]);
const totalBooks = ref(0);
const totalGenres = ref(0);
const loading = ref(false);

const loadData = async () => {
  loading.value = true;
  try {
    const [ordersRes, booksRes, genresRes] = await Promise.all([
      orderService.getAllOrdersForAdmin().catch(() => ({ data: [] })),
      bookService.getAllBooks({ page: 0, size: 1 }).catch(() => ({ data: { totalElements: 0 } })),
      genreService.getAllGenresNoPage().catch(() => ({ data: [] }))
    ]);

    orders.value = ordersRes.data || ordersRes || [];
    totalBooks.value = booksRes.data?.totalElements ?? booksRes.totalElements ?? 0;
    const gList = genresRes.data || genresRes || [];
    totalGenres.value = Array.isArray(gList) ? gList.length : 0;
  } finally {
    loading.value = false;
  }
};

const recentOrders = computed(() => orders.value.slice(0, 5));

const totalRevenue = computed(() => {
  return orders.value
    .filter(o => o.status !== 'CANCELED')
    .reduce((sum, o) => sum + Number(o.totalPrice || 0), 0);
});

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
  return new Date(dateStr).toLocaleDateString('vi-VN');
};

onMounted(() => {
  loadData();
});
</script>

<style scoped>
.bg-gradient-navy {
  background: linear-gradient(135deg, #07264d 0%, #164e8d 100%);
}
.stat-card {
  border-left: 4px solid #143d8f;
}
</style>