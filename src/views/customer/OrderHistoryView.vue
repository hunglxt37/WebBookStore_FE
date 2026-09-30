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
            <v-card v-for="order in orderStore.orders" :key="order.id" class="mb-4" rounded="lg" elevation="2">
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
                            <div class="text-caption text-grey">
                                Sản phẩm
                            </div>

                            <div class="font-weight-medium">
                                {{ order.firstBookName || 'Sách đã mua' }}
                            </div>

                            <div class="text-body-2 text-grey mt-1">
                                {{ order.totalItems }} sản phẩm
                            </div>
                        </v-col>

                        <!-- Giao hàng -->
                        <v-col cols="12" md="3">
                            <div class="text-caption text-grey">
                                Giao hàng
                            </div>

                            <div class="text-body-2">
                                {{ order.deliveryName || 'Tiêu chuẩn' }}
                            </div>
                        </v-col>

                        <!-- Thanh toán -->
                        <v-col cols="12" md="2">
                            <div class="text-caption text-grey">
                                Thanh toán
                            </div>

                            <div class="text-body-2">
                                {{ order.paymentName || 'COD' }}
                            </div>
                        </v-col>

                        <!-- Tổng tiền -->
                        <v-col cols="12" md="2" class="text-md-right">
                            <div class="text-caption text-grey">
                                Tổng tiền
                            </div>

                            <div class="text-h6 font-weight-bold text-primary">
                                {{ formatPrice(order.totalPrice) }} đ
                            </div>
                        </v-col>
                    </v-row>
                </v-card-text>

                <v-divider />

                <!-- Actions -->
                <v-card-actions class="pa-4">
                    <v-btn variant="outlined" color="primary" prepend-icon="mdi-eye-outline"
                        @click="viewOrder(order.id)">
                        Xem chi tiết
                    </v-btn>

                    <v-spacer />

                    <!-- Delete / Cancel -->
                    <v-btn v-if="order.status === 'PENDING'" variant="outlined" color="error"
                        prepend-icon="mdi-delete-outline" @click="cancelOrder(order.id)">
                        Hủy đơn
                    </v-btn>
                </v-card-actions>
            </v-card>
        </div>

        <!-- Dialog Chi tiết đơn hàng -->
        <v-dialog v-model="showDetailDialog" max-width="850">
            <v-card v-if="selectedOrder" rounded="lg">
                <v-card-title class="d-flex justify-space-between align-center pa-4 bg-primary text-white">
                    <span class="text-h6 font-weight-bold">
                        Chi tiết đơn hàng #{{ selectedOrder.orderCode || selectedOrder.id }}
                    </span>
                    <v-btn icon="mdi-close" variant="text" color="white" density="compact" @click="showDetailDialog = false" />
                </v-card-title>

                <v-card-text class="pa-4">
                    <!-- Trạng thái & ngày -->
                    <div class="d-flex justify-space-between align-center mb-4">
                        <div class="text-caption text-grey">
                            Thời gian đặt: {{ formatDate(selectedOrder.createdAt) }}
                        </div>
                        <v-chip :color="getStatusColor(selectedOrder.status)" size="small">
                            {{ getStatusText(selectedOrder.status) }}
                        </v-chip>
                    </div>

                    <!-- Thông tin giao hàng -->
                    <v-row class="mb-4">
                        <v-col cols="12" md="6">
                            <div class="border rounded pa-3 h-100">
                                <div class="font-weight-bold mb-2 text-subtitle-2 text-primary">Thông tin nhận hàng</div>
                                <div class="text-body-2"><strong>Họ tên:</strong> {{ selectedOrder.fullName }}</div>
                                <div class="text-body-2"><strong>Số điện thoại:</strong> {{ selectedOrder.phone }}</div>
                                <div class="text-body-2"><strong>Địa chỉ:</strong> {{ selectedOrder.deliveryAddress }}</div>
                                <div v-if="selectedOrder.note" class="text-body-2 text-grey-darken-1 mt-1">
                                    <strong>Ghi chú:</strong> {{ selectedOrder.note }}
                                </div>
                            </div>
                        </v-col>
                        <v-col cols="12" md="6">
                            <div class="border rounded pa-3 h-100">
                                <div class="font-weight-bold mb-2 text-subtitle-2 text-primary">Phương thức</div>
                                <div class="text-body-2"><strong>Vận chuyển:</strong> {{ selectedOrder.deliveryName }}</div>
                                <div class="text-body-2"><strong>Thanh toán:</strong> {{ selectedOrder.paymentName }}</div>
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
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, idx) in selectedOrder.orderDetails" :key="item.id">
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
                            </tr>
                        </tbody>
                    </v-table>

                    <!-- Tổng thanh toán -->
                    <div class="d-flex flex-column align-end ga-1">
                        <div class="text-body-2">Tiền hàng: <strong>{{ formatPrice(selectedOrder.totalPriceProduct) }} đ</strong></div>
                        <div class="text-body-2">Phí vận chuyển: <strong>{{ formatPrice(selectedOrder.feeDelivery) }} đ</strong></div>
                        <div class="text-body-2">Phí thanh toán: <strong>{{ formatPrice(selectedOrder.feePayment) }} đ</strong></div>
                        <v-divider class="my-2" style="width: 250px" />
                        <div class="text-h6 font-weight-bold text-red">
                            Tổng thanh toán: {{ formatPrice(selectedOrder.totalPrice) }} đ
                        </div>
                    </div>
                </v-card-text>

                <v-divider />

                <v-card-actions class="pa-3">
                    <v-spacer />
                    <v-btn variant="tonal" color="grey-darken-1" @click="showDetailDialog = false">
                        Đóng
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup>
import { useOrderStore } from "@/stores/order.store";
import { ref, onMounted } from "vue";

const orderStore = useOrderStore();
const showDetailDialog = ref(false);
const selectedOrder = ref(null);

onMounted(async () => {
    await orderStore.getMyOrders();
});

const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(Number(price) || 0);
};

const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleString("vi-VN");
};

const getStatusText = (status) => {
    const statusMap = {
        PENDING: "Chờ xác nhận",
        CONFIRMED: "Đã xác nhận",
        SHIPPING: "Đang giao",
        COMPLETED: "Hoàn thành",
        DELIVERED: "Đã giao",
        CANCELED: "Đã hủy",
        CANCELLED: "Đã hủy",
    };

    return statusMap[status] || status;
};

const getStatusColor = (status) => {
    const colorMap = {
        PENDING: "orange",
        CONFIRMED: "blue",
        SHIPPING: "primary",
        COMPLETED: "green",
        DELIVERED: "green",
        CANCELED: "red",
        CANCELLED: "red",
    };

    return colorMap[status] || "grey";
};

const viewOrder = async (orderId) => {
    const order = await orderStore.getOrderById(orderId);
    selectedOrder.value = order;
    showDetailDialog.value = true;
};

const cancelOrder = async (orderId) => {
    const confirmDelete = confirm("Bạn có chắc chắn muốn hủy đơn hàng này không?");
    if (!confirmDelete) return;

    try {
        await orderStore.cancelOrder(orderId, "Khách hàng yêu cầu hủy đơn");
        await orderStore.getMyOrders();
    } catch (error) {
        console.error("Cancel order error:", error);
    }
};
</script>

<style scoped>
.orders-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 24px;
}
</style>