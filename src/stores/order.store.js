import { defineStore } from "pinia";
import orderService from "@/services/order.service";

export const useOrderStore = defineStore("order", {
  state: () => ({
    // Danh sách đơn hàng của user
    orders: [],

    // Đơn hàng hiện tại
    currentOrder: null,
    loading: false,
  }),

  actions: {
    async getMyOrders() {
      this.loading = true;
      try {
        const response = await orderService.getMyOrder();
        this.orders = response.data;
        return this.orders;
      } catch (err) {
        console.log(err);
      } finally {
        this.loading = false;
      }
    },

    async createOrder(orderData) {
      this.loading = true;
      try {
        const response = await orderService.createOrder(orderData);
        this.currentOrder = response.data;
        return this.currentOrder;
      } finally {
        this.loading = false;
      }
    },

    async cancelOrder(id, reason) {
      this.loading = true;
      try {
        return await orderService.cancelOrder(id, reason);
      } finally {
        this.loading = false;
      }
    },

    async getOrderById(id) {
      this.loading = true;
      try {
        const response = await orderService.getOrderById(id);
        this.currentOrder = response.data;
        return this.currentOrder;
      } finally {
        this.loading = false;
      }
    },
  },
});
